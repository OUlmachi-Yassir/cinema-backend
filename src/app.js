const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  
const path = require('path');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const filmRoutes = require('./routes/filmRoutes');
const roomRoutes = require('./routes/roomRoutes');
const seanceRoutes = require('./routes/seanceRoutes');
const reservation = require('./routes/reservationRoutes');
const commentRoutes = require('./routes/commentRoutes');
const favoriteRootes = require('./routes/favoriteRoutes')
const RatingRoutes = require('./routes/ratingRoutes');

const cookieParser = require('cookie-parser');
const Seance = require('./models/seanceModel');
const Film = require('./models/filmModel');

const { minioClient, BUCKET_NAME } = require('./config/minioConfig'); // <-- Import here

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));

app.use('/api/auth', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/seance', seanceRoutes);
app.use('/api/reservation',reservation);
app.use('/api/comments', commentRoutes);
app.use('/api/favorite',favoriteRootes);
app.use('/api/',RatingRoutes);


app.get('/api/seances', async (req, res) => {
  const { filmId } = req.query;

  if (!filmId) {
    return res.status(400).json({ message: 'Film ID is required' });
  }

  try {
    const seances = await Seance.find({ film: filmId }).populate('room');
    res.json(seances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching seances' });
  }
});

app.get('/api/films/:filmId', async (req, res) => {
  const filmId = req.params.filmId;
  try {

    if (!filmId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid film ID format' });
    }

    const film = await Film.findById(filmId);
    if (!film) {
      return res.status(404).json({ error: 'Film not found' });
    }

    let videoUrl = null;
    if (film.video) {
      minioClient.presignedGetObject(
        BUCKET_NAME,
        film.video.replace(`/${BUCKET_NAME}/`, ''),
        24 * 60 * 60, 
        (err, url) => {
          if (err) {
            console.error('Error generating video URL:', err);
            return res.status(500).json({ error: 'Error generating video URL' });
          }
          res.json({ ...film.toObject(), videoUrl: url });
        }
      );
    } else {
      res.json(film);
    }
  } catch (err) {
    console.error('Error fetching film:', err); 
    res.status(500).json({ error: 'An error occurred while fetching the film' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
