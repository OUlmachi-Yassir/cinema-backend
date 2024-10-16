const express = require('express');
const { createRoom, getRooms,updateRoom, deleteRoom} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/add', protect, adminOnly, createRoom);
router.put('/update/:id',updateRoom);
router.delete('/delete/:id',deleteRoom); 


router.get('/', getRooms);

module.exports = router;
