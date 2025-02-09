const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isTokenBlacklisted } = require('../middlewares/tokenBlacklist');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Not authorized, token has expired' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


const adminOnly = (req, res, next) => {
  if (req.user) {
    console.log('User role:', req.user.role); 

    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access only' });
    }
  } else {
    res.status(403).json({ message: 'User not found' });
  }
};

module.exports = { protect, adminOnly };
