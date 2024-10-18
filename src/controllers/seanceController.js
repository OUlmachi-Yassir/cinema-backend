const Room = require('../models/roomModel');
const Seance = require('../models/seanceModel');


const createSeance = async (req, res) => {
  const { horaire, tarif, film, room } = req.body;

  try {
    const foundRoom = await Room.findById(room);

    if (!foundRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }


    const seats = Array.from({ length: foundRoom.numberOfSeats }, (_, i) => ({
      seatNumber: `Seat-${i + 1}`,
      isAvailable: true
    }));

    const seance = new Seance({
      horaire,
      tarif,
      film,
      room,
      seats, 
      placesDisponibles: foundRoom.numberOfSeats
    });

    const createdSeance = await seance.save();
    res.status(201).json(createdSeance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getSeances = async (req, res) => {
  try {
    const seances = await Seance.find()
      .populate('film')
      .populate('room');
    res.status(200).json(seances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSeanceById = async (req, res) => {
  try {
    const seance = await Seance.findById(req.params.id)
      .populate('film')
      .populate('room');

    if (!seance) {
      return res.status(404).json({ message: 'Séance not found' });
    }

    res.status(200).json(seance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateSeance = async (req, res) => {
  const { horaire, tarif, film, room } = req.body;

  try {
    const seance = await Seance.findById(req.params.id);

    if (!seance) {
      return res.status(404).json({ message: 'Séance not found' });
    }

    seance.horaire = horaire || seance.horaire;
    seance.tarif = tarif || seance.tarif;
    seance.film = film || seance.film;
    seance.room = room || seance.room;

    const updatedSeance = await seance.save();
    res.status(200).json(updatedSeance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteSeance = async (req, res) => {
  const { id } = req.params
  try {
    const seance = await Seance.findById( id );

    if (!seance) {
      return res.status(404).json({ message: 'Séance not found' });
    }

    await Seance.deleteOne({ _id : id });
    res.status(200).json({ message: 'Séance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSeance,
  getSeances,
  getSeanceById,
  updateSeance,
  deleteSeance
};
