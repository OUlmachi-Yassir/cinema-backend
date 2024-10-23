const express = require('express');
const { addOrUpdateRating, getFilmRatings,getUserFilmRating } = require('../controllers/ratingController');

const router = express.Router();

router.post('/rating', addOrUpdateRating);
router.get('/rating/:filmId', getFilmRatings);
router.get('/rating/:filmId/:userId', getUserFilmRating);


module.exports = router;
