const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = async (id) =>
  await jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

const createSendToken = async (user, statusCode, res) => {
  const token = await signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  await createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exist
  if (!email || !password) {
    return next(appError('Please provide email and password', 400));
  }

  //check if user exists and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(appError('Wrong email or password', 401));
  }

  //if everything is OK, send token to client
  await createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'Logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      appError('You are not logged in. Please login to get access', 401),
    );
  }

  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      appError('The user belonging to this token does no longer exist', 401),
    );
  }

  //check if user changed password after the token was issued
  const passwordChanged = currentUser.changedPasswordAfter(decoded.iat);
  if (passwordChanged) {
    return next(
      appError(
        'Password changed. You need to login with your new password',
        401,
      ),
    );
  }

  //grant access to protected routes
  req.user = currentUser;

  next();
});

//Only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  try {
    //get token and check if it's there
    if (req.cookies.jwt) {
      //verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      //check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //check if user changed password after the token was issued
      const passwordChanged = currentUser.changedPasswordAfter(decoded.iat);
      if (passwordChanged) {
        return next();
      }

      //There is a logged in user
      res.locals.user = currentUser;
      return next();
    }
  } catch (error) {
    return next();
  }
  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        appError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(appError('There is no user with that email address', 404));
  }

  //generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({ status: 'success', message: 'Token sent to email' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      appError(
        'There was an error sending the email. Please try again later',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //if token has not expired, and there is user, set the new password
  if (!user) {
    return next(appError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //update the changedPasswordAt property for the user
  //log the user in, send JWT
  await createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //check the posted current password is correct
  if (
    !(await (user.correctPassword(req.body.passwordCurrent), user.password))
  ) {
    return next(appError('Your current password is wrong.', 401));
  }
  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //log user in, send JWT
  await createSendToken(user, 200, res);
});
