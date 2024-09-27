const express = require('express');
const { createRoom, getRooms,updateRoom, deleteRoom} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/add', protect, adminOnly, createRoom);
router.put('/update/:id', protect, adminOnly,updateRoom);
router.delete('/delete/:id', protect, adminOnly,deleteRoom); 


router.get('/', getRooms);

module.exports = router;
