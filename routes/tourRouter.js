const express = require('express');

const {
  getAllTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('./../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkBody, addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
