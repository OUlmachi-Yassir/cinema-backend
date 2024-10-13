const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  
const path = require('path');
const cors = require('cors');


const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const filmRoutes = require('./routes/filmRoutes');
const roomRoutes = require('./routes/roomRoutes');
const seanceRoutes =require('./routes/seanceRoutes');
const reservation =require('./routes/reservationRoutes');

const cookieParser = require('cookie-parser');
const Seance = require('./models/seanceModel');
const Film = require('./models/filmModel');



dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 



app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/seance', seanceRoutes);
app.use('/api/reservation',reservation);

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
    const film = await Film.findById(filmId);
    res.json(film);
  } catch (err) {
    res.status(500).json({ error: 'Film not found' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;