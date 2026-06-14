const hrService = require('../services/hrService');

class HrController {
    async getEmployees(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            
            const employees = await hrService.getEmployees(page, limit);
            res.status(200).json({ success: true, count: employees.length, data: employees });
        } catch (error) {
            next(error);
        }
    }

    async uploadAvatar(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Please upload an image file' });
            }

            const result = await hrService.uploadAvatar(req.user.id, req.file.filename);
            res.status(200).json({ success: true, message: 'Avatar updated', data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new HrController();
