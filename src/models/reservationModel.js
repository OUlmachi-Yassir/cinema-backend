const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  seance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seance',
    required: true,
  },
  seatNumbers: {  
    type: [String], 
    required: true,
  }
}, {
  timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
