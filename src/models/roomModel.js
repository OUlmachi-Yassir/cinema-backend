const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  films: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film', 
  }],
  seats: [{
    seatNumber: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
