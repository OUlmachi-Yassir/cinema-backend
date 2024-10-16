const Room = require('../models/roomModel');


const createRoom = async (req, res) => {
  const { name, numberOfSeats,type } = req.body;

  try {
    const newRoom = new Room({
      name,
      numberOfSeats,
      type
    });

    const createdRoom = await newRoom.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, numberOfSeats, type } = req.body;

  try {
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.name = name || room.name;
    room.type = type || room.type;

    if (numberOfSeats) {
      room.numberOfSeats = numberOfSeats;
    }

    const updatedRoom = await room.save();
    res.status(200).json({
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(`Error deleting room with ID ${id}:`, error); 
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom
};
