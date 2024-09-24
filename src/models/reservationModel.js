const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
  clientName: {
    type: String,
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
  seat: {
    seatNumber: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
