const authService = require('../services/authService');
const { validateRegistration, validateLogin } = require('../validators/authValidator');

class AuthController {
    async register(req, res, next) {
        try {
            const { error, value } = validateRegistration(req.body);
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const result = await authService.register(value);
            res.status(201).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { error, value } = validateLogin(req.body);
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const result = await authService.login(value.email, value.password);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();
