require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userDataRoutes = require('./routes/userDataRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

//  MongoDB
mongoose
    .connect(process.env.DB_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection failed:', err));

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// UserData Routes
app.use('/api', userDataRoutes);

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path === '/health') {
        return next();
    }
    res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
