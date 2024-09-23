const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Film = mongoose.model('Film', filmSchema);
module.exports = Film;
