const express = require('express');
const { registerUser, loginUser,updateUserProfile,getUserProfile,sendNotification, logoutUser,sendPasswordResetEmail, resetPassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',logoutUser);

router.post('/forgot-password', sendPasswordResetEmail); 
router.post('/reset-password', resetPassword); 


router.get('/notify', protect, sendNotification);
router.get('/profile', protect, getUserProfile); 
router.put('/profile', protect, updateUserProfile);

module.exports = router;
