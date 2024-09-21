// src/routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, sendNotification } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Admin-only routes
router.get('/notify', protect, sendNotification);

module.exports = router;
