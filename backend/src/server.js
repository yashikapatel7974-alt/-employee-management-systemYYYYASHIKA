require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const app = require('./app');
const logger = require('./utils/logger');

const { startScheduler } = require('./jobs/scheduler');

const PORT = process.env.PORT || 5000;

// Start background cron jobs
startScheduler();

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
