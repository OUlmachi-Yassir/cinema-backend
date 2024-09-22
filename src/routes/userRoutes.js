const express = require('express');
const { registerUser, loginUser, sendNotification, logoutUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { welcomeUser } = require('../controllers/userController');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',logoutUser);


router.get('/notify', protect, sendNotification);


router.get('/welcome', protect, welcomeUser);

module.exports = router;
