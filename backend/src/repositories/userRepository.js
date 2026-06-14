const db = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    async createUser(email, passwordHash, role = 'Employee') {
        const query = `
            INSERT INTO users (email, password_hash, role) 
            VALUES ($1, $2, $3) RETURNING id, email, role, is_active
        `;
        const result = await db.query(query, [email, passwordHash, role]);
        return result.rows[0];
    }

    async createEmployeeProfile(userId, firstName, lastName, dateOfJoining, salary) {
        const query = `
            INSERT INTO employee_profiles (user_id, first_name, last_name, date_of_joining, salary)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const result = await db.query(query, [userId, firstName, lastName, dateOfJoining, salary]);
        return result.rows[0];
    }
}

module.exports = new UserRepository();
