const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  // updateUserData,
} = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);
router.get('/me', protect, getAccount);

// use form submit method
// router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
