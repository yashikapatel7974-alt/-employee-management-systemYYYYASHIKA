const hrRepository = require('../repositories/hrRepository');
const db = require('../config/db');

class HrService {
    async getEmployees(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return await hrRepository.getAllProfiles(limit, offset);
    }

    async uploadAvatar(userId, filename) {
        // Find employee_id from user_id
        const employeeQuery = await db.query('SELECT id FROM employee_profiles WHERE user_id = $1', [userId]);
        if (employeeQuery.rows.length === 0) {
            const err = new Error('Employee profile not found');
            err.statusCode = 404;
            throw err;
        }
        const employeeId = employeeQuery.rows[0].id;
        const avatarUrl = `/uploads/${filename}`;
        
        return await hrRepository.updateAvatar(employeeId, avatarUrl);
    }
}

module.exports = new HrService();
