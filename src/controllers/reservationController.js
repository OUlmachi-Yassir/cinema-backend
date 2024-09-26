const Reservation = require('../models/reservationModel');
const Room = require('../models/Room');


const createReservation = async (req, res) => {
  const { film, roomId, seatNumber } = req.body;
  const client = req.user._id; 

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

  
    const seat = room.seats.find(seat => seat.seatNumber === seatNumber && seat.isAvailable);

    if (!seat) {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    
    seat.isAvailable = false;
    await room.save();

   
    const reservation = new Reservation({
      client,
      film,
      room: room._id,
      seatNumber
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reservations for the authenticated client
// @route   GET /api/reservations
// @access  Client
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.user._id })
      .populate('film')
      .populate('room');
    
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations
};
