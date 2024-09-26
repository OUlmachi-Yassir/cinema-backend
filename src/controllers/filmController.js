const Film = require('../models/filmModel');


const getFilms = async (req, res) => {
  try {
    const films = await Film.find();
    res.json(films);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addFilm = async (req, res) => {
  const { title, director, releaseYear, genre } = req.body;

  try {
    const newFilm = new Film({ title, director, releaseYear, genre });
    await newFilm.save();
    res.status(201).json({ message: 'Film added successfully', newFilm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFilm = async (req, res) => {
  const { id } = req.params;
  const { title, director, releaseYear, genre } = req.body;

  try {
    const film = await Film.findById(id);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    
    film.title = title || film.title;
    film.director = director || film.director;
    film.releaseYear = releaseYear || film.releaseYear;
    film.genre = genre || film.genre;

    await film.save();
    res.json({ message: 'Film updated successfully', film });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteFilm = async (req, res) => {
  const { id } = req.params;

  try {
    const film = await Film.findById(id);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    await film.remove();
    res.json({ message: 'Film deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFilms, addFilm, updateFilm, deleteFilm };
