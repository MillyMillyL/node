const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5'],
    },
    review: { type: String, required: [true, 'Review can not be empty'] },
    createdAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
