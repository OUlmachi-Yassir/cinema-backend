const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  numberOfSeats: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Standard', 'VIP', 'IMAX', '3D'], 
    required: true,
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
