const express = require('express');
const { addRating, getFilmRatings } = require('../controllers/ratingController');

const router = express.Router();

router.post('/rating', addRating);
router.get('/rating/:filmId', getFilmRatings);

module.exports = router;
