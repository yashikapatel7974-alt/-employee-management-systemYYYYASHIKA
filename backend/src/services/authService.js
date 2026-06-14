const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const db = require('../config/db');

class AuthService {
    async register(userData) {
        const { email, password, role, firstName, lastName, dateOfJoining, salary } = userData;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const client = await db.getClient();
        try {
            await client.query('BEGIN');
            
            const newUser = await userRepository.createUser(email, passwordHash, role);
            const newProfile = await userRepository.createEmployeeProfile(
                newUser.id, firstName, lastName, dateOfJoining, salary
            );
            
            // Initialize leave balance via Stored Procedure
            await client.query('CALL allocate_initial_leave_balance($1)', [newProfile.id]);

            await client.query('COMMIT');
            
            return this.generateAuthResponse(newUser);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user || !user.is_active) {
            const error = new Error('Invalid credentials or inactive account');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        return this.generateAuthResponse(user);
    }

    generateAuthResponse(user) {
        const payload = { id: user.id, role: user.role };
        
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        });

        return {
            user: { id: user.id, email: user.email, role: user.role },
            accessToken,
            refreshToken
        };
    }
}

module.exports = new AuthService();
