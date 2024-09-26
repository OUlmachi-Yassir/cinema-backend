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
  seats: [seatSchema], 
  type: {
    type: String,
    enum: ['Eco', 'VIP'],
    default: 'Eco',  
    required: true
  },
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
