const mongoose = require('mongoose');
const Reservation = require('../models/reservationModel');
const Seance = require('../models/seanceModel');

const createReservation = async (req, res) => {
  const { seance: seanceId, seatNumbers } = req.body;

  try {
    const clientId = req.user._id;

    const seance = await Seance.findById(seanceId).populate('room');
    if (!seance) {
      return res.status(404).json({ message: 'Seance not found' });
    }

    const availableSeats = seance.seats.filter(seat => seat.isAvailable);
    const availableSeatNumbers = availableSeats.map(seat => seat.seatNumber);

    const invalidSeats = seatNumbers.filter(seat => !availableSeatNumbers.includes(seat));
    if (invalidSeats.length > 0) {
      return res.status(400).json({ message: `Invalid or unavailable seat numbers: ${invalidSeats.join(', ')}` });
    }

    if (availableSeats.length < seatNumbers.length) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    const existingReservations = await Reservation.find({
      seance: seanceId,
      seatNumbers: { $in: seatNumbers }
    });

    const alreadyReservedSeats = existingReservations.reduce((acc, reservation) => 
      acc.concat(reservation.seatNumbers), []);

    const unavailableSeats = seatNumbers.filter(seat => alreadyReservedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: `Seats already reserved: ${unavailableSeats.join(', ')}` });
    }

    const reservation = new Reservation({
      client: clientId,
      seance: seanceId,
      seatNumbers
    });
    await reservation.save();

    seance.seats.forEach(seat => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.isAvailable = false;
      }
    });

    await seance.save();

    res.status(201).json({
      message: 'Seats reserved successfully',
      reservation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'One or more seats are already reserved' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getReservationsByClient = async (req, res) => {
  try {
    const clientId = req.user._id;
    const reservations = await Reservation.find({ client: clientId })
      .populate('seance')
      .populate('client');

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservationsByClient
};
