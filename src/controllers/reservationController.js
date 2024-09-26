const Reservation = require('../models/reservationModel');
const Seance = require('../models/seanceModel');

const createReservation = async (req, res) => {
  const { seance, nombrePlace } = req.body;

  try {
    const clientId = req.user._id;

    const foundSeance = await Seance.findById(seance);

    if (!foundSeance) {
      return res.status(404).json({ message: 'Seance not found' });
    }

    if (foundSeance.placesDisponibles < nombrePlace) {
      return res.status(400).json({ message: 'Not enough available seats for this seance' });
    }

    const reservation = new Reservation({
      client: clientId,
      seance,
      nombrePlace,
    });

    const createdReservation = await reservation.save();

    foundSeance.placesDisponibles -= nombrePlace;
    await foundSeance.save();

    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservationsByClient
};
