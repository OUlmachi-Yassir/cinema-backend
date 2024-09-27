const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const filmRoutes = require('./routes/filmRoutes');
const roomRoutes = require('./routes/roomRoutes');
const seanceRoutes =require('./routes/seanceRoutes');
const reservation =require('./routes/reservationRoutes');

const cookieParser = require('cookie-parser');



dotenv.config();


connectDB();

const app = express();


app.use(express.json());
app.use(cookieParser()); 


app.use('/api/auth', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/seance', seanceRoutes);
app.use('/api/reservation',reservation);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;