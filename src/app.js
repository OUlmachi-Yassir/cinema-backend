const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Updated path for DB connection
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;