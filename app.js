const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const viewRoutes = require('./routes/viewRoutes');
const { webhookCheckout } = require('./controllers/bookingController');

const app = express();
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//global middlewares
//implement CORS
app.use(cors());
//access-control-allow-origin *,
//allow everyone to consume our API
//example api.natours.com, front-end natours.com
// app.use(cors({ origin: 'https://www.natours.com' }));

// app.options('*', cors());
app.options('/api/v1/tours/:id', cors()); //only the tours counld be deleted or patched from a cross-origin request

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

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
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

app.use(compression());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes

app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);

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
