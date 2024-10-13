const mongoose = require('mongoose');
const Reservation = require('../models/reservationModel');
const Seance = require('../models/seanceModel');
const Room = require('../models/roomModel');


const createReservation = async (req, res) => {
  const { seance: seanceId, seatNumbers } = req.body;

  try {
    const clientId = req.user._id;

    const seance = await Seance.findById(seanceId).populate('room');

    if (!seance) {
      return res.status(404).json({ message: 'Seance not found' });
    }

    const roomSeatNumbers = seance.room.seats.map(seat => seat.seatNumber);
    const invalidSeats = seatNumbers.filter(seat => !roomSeatNumbers.includes(seat));

    if (invalidSeats.length > 0) {
      return res.status(400).json({ message: `Invalid seat numbers: ${invalidSeats.join(', ')}` });
    }

    if (seance.placesDisponibles < seatNumbers.length) {
      return res.status(400).json({ message: 'Not enough available places' });
    }

    const existingReservations = await Reservation.find({
      seance: seanceId,
      seatNumbers: { $in: seatNumbers }
    });

    const alreadyReservedSeats = existingReservations.reduce((acc, reservation) => {
      return acc.concat(reservation.seatNumbers);
    }, []);

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

    const updatedSeance = await Seance.findOneAndUpdate(
      { _id: seanceId, placesDisponibles: { $gte: seatNumbers.length }, __v: seance.__v },
      { 
        $inc: { placesDisponibles: -seatNumbers.length },
        $inc: { __v: 1 }
      },
      { new: true }
    );

    if (!updatedSeance) {
      await Reservation.findByIdAndDelete(reservation._id);
      return res.status(409).json({ message: 'Failed to reserve seats due to concurrent updates. Please try again.' });
    }

    await Room.updateOne(
      { _id: seance.room._id, 'seats.seatNumber': { $in: seatNumbers } },
      { $set: { 'seats.$[seat].isAvailable': false } },
      { arrayFilters: [{ 'seat.seatNumber': { $in: seatNumbers } }] }
    );

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
