const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userDataRoutes = require('./routes/userDataRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/userManagerDB', {})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection failed:', err));

// Basic Hello World Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World from User Manager Service!' });
});

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// UserData Routes
app.use('/api', userDataRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
