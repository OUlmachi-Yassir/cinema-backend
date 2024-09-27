const Room = require('../models/roomModel');


const createRoom = async (req, res) => {
  const { name, seatCount,type } = req.body;

  try {
    
    const seats = [];
    for (let i = 1; i <= seatCount; i++) {
      seats.push({
        seatNumber: `Seat-${i}`,
        isAvailable: true 
      });
    }

 
    const newRoom = new Room({
      name,
      seats,
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
  const { name, seatCount, type } = req.body;

  try {
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.name = name || room.name;
    room.type = type || room.type;

    if (seatCount) {
      const seats = [];
      for (let i = 1; i <= seatCount; i++) {
        seats.push({
          seatNumber: `Seat-${i}`,
          isAvailable: true
        });
      }
      room.seats = seats;
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
    const rooms = await Room.find().populate('film');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.remove(); 
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom
};
