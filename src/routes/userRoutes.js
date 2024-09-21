const express = require('express');
const { registerUser, loginUser, sendNotification } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/notify', protect, sendNotification);

module.exports = router;
