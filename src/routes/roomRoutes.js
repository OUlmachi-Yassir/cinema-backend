const express = require('express');
const { createRoom, getRooms } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/', protect, admin, createRoom);


router.get('/', getRooms);

module.exports = router;
