const mongoose = require('mongoose');
const ratingSchema = mongoose.Schema({
    filmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ratingValue: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
}, {
  timestamps: true
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
