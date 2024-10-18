const Film = require('../models/filmModel');
const Reservation = require('../models/reservationModel');
const Seance = require('../models/seanceModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const getAdmins = async (req, res) => {
  const admins = await User.find({ role: 'admin' });
  res.json(admins);
};

const addAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    name,
    email,
    password: hashedPassword,
    role: 'admin' 
  });

  await admin.save();
  res.json({ message: 'Admin added successfully', admin });
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const admin = await User.findById(id);
  if (!admin || admin.role !== 'admin') {
    return res.status(404).json({ message: 'Admin not found' });
  }

  admin.name = name || admin.name;
  admin.email = email || admin.email;

  if (password) {
    admin.password = await bcrypt.hash(password, 10);
  }

  await admin.save();
  res.json({ message: 'Admin updated successfully', admin });
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getStatistics = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'client' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const filmCount = await Film.countDocuments();
    const seanceCount = await Seance.countDocuments();
    const reservationCount = await Reservation.countDocuments();

    res.status(200).json({
      users: userCount,
      admins: adminCount,
      films: filmCount,
      seances: seanceCount,
      reservations: reservationCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdmins, addAdmin, updateAdmin, deleteAdmin,getStatistics };
