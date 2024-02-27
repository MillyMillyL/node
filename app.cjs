const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError.cjs');
const globalErrorHandler = require('./controllers/errorController.cjs');
const tourRouter = require('./routes/tourRouter.cjs');
const userRouter = require('./routes/userRouter.cjs');
const reviewRoutes = require('./routes/reviewRoutes.cjs');
const viewRoutes = require('./routes/viewRoutes.cjs');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//global middlewares
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security http headers
app.use(helmet({ contentSecurityPolicy: false }));

//development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against xss
// app.use(xss); xxs-clean depericated

//prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies, 'req.cookies app');
  next();
});

//Routes

app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  const error = AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
