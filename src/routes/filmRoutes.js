const express = require('express');
const { getFilms, addFilm, updateFilm, deleteFilm } = require('../controllers/filmController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); // Protect routes with admin check if needed
const router = express.Router();

// Film CRUD routes
router.get('/', protect, getFilms); // Get all films
router.post('/addfilm', protect, adminOnly, addFilm); // Add a new film (Admins only)
router.put('/updateFilm/:id', protect, adminOnly, updateFilm); // Update film by ID (Admins only)
router.delete('/deleteFilm/:id', protect, adminOnly, deleteFilm); // Delete film by ID (Admins only)

module.exports = router;
