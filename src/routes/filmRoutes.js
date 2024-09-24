const express = require('express');
const { getFilms, addFilm, updateFilm, deleteFilm } = require('../controllers/filmController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 
const router = express.Router();


router.get('/', protect, getFilms); 
router.post('/addfilm', protect, adminOnly, addFilm); 
router.put('/updateFilm/:id', protect, adminOnly, updateFilm); 
router.delete('/deleteFilm/:id', protect, adminOnly, deleteFilm); 

module.exports = router;
