const express = require('express');
const { createRoom, getRooms } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/add', protect, adminOnly, createRoom);


router.get('/', getRooms);

module.exports = router;
