const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  // updateUserData,
  getMyTours,
} = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', createBookingCheckout, getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

// use form submit method
// router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
