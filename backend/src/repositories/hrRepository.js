const db = require('../config/db');

class HrRepository {
    async getAllProfiles(limit = 10, offset = 0) {
        const query = `
            SELECT ep.*, d.name as department_name, u.email, u.role
            FROM employee_profiles ep
            JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d ON ep.department_id = d.id
            ORDER BY ep.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    async updateAvatar(employeeId, avatarUrl) {
        const query = 'UPDATE employee_profiles SET avatar_url = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [avatarUrl, employeeId]);
        return result.rows[0];
    }
}

module.exports = new HrRepository();
