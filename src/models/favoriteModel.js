const mongoose = require('mongoose');


const favoriteSchema = mongoose.Schema({
  Client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film', 
    required: true
  },
  myFavorite: {
    type:Boolean,
    default:false
  }
}, {
  timestamps: true
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
