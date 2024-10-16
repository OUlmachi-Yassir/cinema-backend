const mongoose = require('mongoose');

const releaseYearRegex = /^\d{4}-\d{2}-\d{2}$/;

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
  releaseYear: {
    type: String, 
    required: [true, 'Release year is required'],
    validate: {
      validator: function(v) {
        return releaseYearRegex.test(v);
      },
      message: props => `${props.value} is not a valid release year! Please use the format YYYY-MM-DD.`
    }
  },
  image: {
    type: String,
    required: true
  },
  video: {
    type: String, 
    required: false,  
  },
}, {
  timestamps: true
});

const Film = mongoose.model('Film', filmSchema);
module.exports = Film;
