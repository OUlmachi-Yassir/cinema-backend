const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',  
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', 
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
