const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const err = AppError(`Invalid ${error.path}: ${error.value}`, 400);
  return err;
};

const handleDuplicateFieldsDB = (error) => {
  const err = AppError(`"${error.keyValue.name}" is not unique`, 400);
  return err;
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((e) => e.properties.message);
  const err = AppError(`Invalid input data: ${errors.join('. ')}`, 400);
  return err;
};

const handleJWTError = () => {
  const err = AppError(`Authentication failed, please login again`, 401);
  return err;
};
const handleJWTExpireError = () => {
  const err = AppError(`Token expired, please login again`, 401);
  return err;
};

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.error(err);
  // rendered website
  return res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong', msg: err.message });
};

const sendErrorProd = (err, req, res) => {
  //operational, trusted error: send message to client
  //API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
      //programing or other unknown error: don't leak error details
    }
    //log error
    console.error(err);
    //send generic messages
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  //rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
    //programing or other unknown error: don't leak error details
  }
  //log error
  console.error(err);
  //send generic messages
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpireError();

    sendErrorProd(error, req, res);
  }
};
