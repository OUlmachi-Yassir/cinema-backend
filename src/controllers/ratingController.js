const Rating = require('../models/ratingModel');

exports.addRating = async (req, res) => {
  const { userId, filmId, ratingValue } = req.body;

  try {
    const newRating = new Rating({ userId, filmId, ratingValue });
    await newRating.save();
    res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};


exports.getFilmRatings = async (req, res) => {
  const { filmId } = req.params;

  try {
    const ratings = await Rating.find({ filmId });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};
