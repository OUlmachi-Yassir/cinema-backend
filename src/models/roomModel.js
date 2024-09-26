const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true 
  }
});


const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film', 
    required: true
  },
  seats: [seatSchema], 
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
