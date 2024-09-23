const express = require('express');
const { addAdmin, updateAdmin, deleteAdmin, getAdmins } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); // Protect routes with admin check if needed
const router = express.Router();


router.get('/', protect, adminOnly, getAdmins); // Get all admins
router.post('/addAdmin', protect, adminOnly, addAdmin); // Add a new admin
router.put('/updateAdmin/:id', protect, adminOnly, updateAdmin); // Update admin by id
router.delete('/deleteAdmin/:id', protect, adminOnly, deleteAdmin); // Delete admin by id

module.exports = router;
