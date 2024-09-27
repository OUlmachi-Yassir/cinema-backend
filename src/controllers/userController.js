const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { addTokenToBlacklist } = require('../middlewares/tokenBlacklist');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',  
  });
};


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
        message: 'User registered successfully',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    addTokenToBlacklist(token);
    res.status(200).json({ message: 'User has logged out successfully' });
  } else {
    res.status(400).json({ message: 'No token provided' });
  }
};


const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(20).toString('hex');

    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested to reset your password. Please click on the following link to reset your password: \n\n${resetUrl}`;

    
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined; 
    await user.save();

    res.status(200).json({ message: 'Your password has been successfully reset.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const sendNotification = async (req, res) => {
  const { user } = req;

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({ message: 'Notification sent!', user });
};

module.exports = {
  registerUser,
  loginUser,
  sendNotification,
  logoutUser,
  sendPasswordResetEmail,
  resetPassword,

};
