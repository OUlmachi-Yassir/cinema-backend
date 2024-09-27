const express = require('express');
const { createReservation, getReservationsByClient } = require('../controllers/reservationController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/Add', protect, createReservation);


router.get('/Myreservation', protect, getReservationsByClient);

module.exports = router;
