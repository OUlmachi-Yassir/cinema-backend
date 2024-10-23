const Rating = require('../models/ratingModel');

exports.addOrUpdateRating = async (req, res) => {
  const { userId, filmId, ratingValue } = req.body;

  try {
    const existingRating = await Rating.findOne({ userId, filmId });

    if (existingRating) {
      existingRating.ratingValue = ratingValue;
      await existingRating.save();
      return res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
    } else {
      const newRating = new Rating({ userId, filmId, ratingValue });
      await newRating.save();
      return res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
    }
  } catch (error) {
    console.error('Error adding/updating rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

exports.getUserFilmRating = async (req, res) => {
    const { filmId, userId } = req.params;
  
    try {
      const rating = await Rating.findOne({ filmId, userId });
  
      if (!rating) {
        return res.status(404).json({ message: 'No rating found for this user' });
      }
      res.status(200).json(rating);
    } catch (error) {
      console.error('Error fetching user rating:', error);
      res.status(500).json({ error: 'Failed to fetch user rating' });
    }
  };

exports.getFilmRatings = async (req, res) => {
  const { filmId } = req.params;

  try {
    const ratings = await Rating.find({ filmId });

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this film' });
    }

    const total = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const averageRating = (total / ratings.length).toFixed(1); 

    res.status(200).json({ averageRating, ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};
