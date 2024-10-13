const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: String,   
  isAvailable: {
    type: Boolean,
    default: true
  }
});


const seanceSchema = new mongoose.Schema({
  horaire: {
    type: Date,
    required: true
  },
  tarif: {
    type: Number,
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
  seats: [seatSchema], 
}, {
  timestamps: true
});

const Seance = mongoose.model('Seance', seanceSchema);
module.exports = Seance;
