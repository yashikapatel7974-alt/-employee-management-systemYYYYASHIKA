const cron = require('node-cron');
const logger = require('../utils/logger');
const db = require('../config/db');

// Schedule a daily job at midnight (0 0 * * *)
const startScheduler = () => {
    cron.schedule('0 0 * * *', async () => {
        logger.info('Running daily background job: Checking for overdue asset returns and pending leaves...');
        
        try {
            // Example Job: Log overdue assets
            const query = `
                SELECT a.asset_tag, aa.return_date, ep.first_name, u.email 
                FROM asset_allocations aa
                JOIN assets a ON aa.asset_id = a.id
                JOIN employee_profiles ep ON aa.employee_id = ep.id
                JOIN users u ON ep.user_id = u.id
                WHERE aa.return_date < CURRENT_DATE
            `;
            const overdueAssets = await db.query(query);

            if (overdueAssets.rows.length > 0) {
                logger.info(`Found ${overdueAssets.rows.length} overdue assets. Initiating notifications...`);
                // TODO: Integrate EmailService to notify HR or employees here
            } else {
                logger.info('No overdue assets found today.');
            }

        } catch (error) {
            logger.error(`Error during daily background job: ${error.message}`);
        }
    });

    logger.info('Background job scheduler started.');
};

module.exports = { startScheduler };
