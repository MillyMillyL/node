const express = require('express');
const {
  getAllTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//nested routes
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), addReview);
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('administrator', 'lead-guide'), getMonthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('administrator', 'lead-guide'), addTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('administrator', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('administrator', 'lead-guide'), deleteTour);

module.exports = router;
