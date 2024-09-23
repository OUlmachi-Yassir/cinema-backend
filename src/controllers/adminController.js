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

  const admin = await User.findById(id);
  if (!admin || admin.role !== 'admin') {
    return res.status(404).json({ message: 'Admin not found' });
  }

  await admin.remove();
  res.json({ message: 'Admin deleted successfully' });
};

module.exports = { getAdmins, addAdmin, updateAdmin, deleteAdmin };
