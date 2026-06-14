const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Import and use actual routes here
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const hrRoutes = require('./routes/hrRoutes');
const assetRoutes = require('./routes/assetRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/assets', assetRoutes);

// Centralized error handler should be the last middleware
app.use(errorHandler);

module.exports = app;
