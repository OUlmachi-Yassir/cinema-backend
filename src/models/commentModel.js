const mongoose = require('mongoose');


const commenteSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  Client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film', 
    required: true
  }
}, {
  timestamps: true
});

const Commente = mongoose.model('Commente', commenteSchema);
module.exports = Commente;
