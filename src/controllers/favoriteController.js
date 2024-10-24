const mongoose = require('mongoose');
const Favorite = require('../models/favoriteModel');
const Film = require('../models/filmModel');

const addFavorite = async (req, res) => {
  const { userId, filmId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: 'Invalid userId or filmId' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const filmObjectId = new mongoose.Types.ObjectId(filmId);

    const existingFavorite = await Favorite.findOne({ Client: userObjectId, film: filmObjectId });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Film is already in your favorite list.' });
    }

    const favorite = new Favorite({
      Client: userObjectId,
      film: filmObjectId,
      myFavorite: true,
    });

    await favorite.save();
    res.status(201).json({ message: 'Film added to favorites!', favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const favorites = await Favorite.find({ Client: userObjectId }).populate('film');
    res.status(200).json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const favorite = await Favorite.findByIdAndDelete(id);

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    res.status(200).json({ message: 'Film removed from favorites.' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
