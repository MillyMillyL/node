const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const {
  getAllReviews,
  addReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, addReview);

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReview);

module.exports = router;
