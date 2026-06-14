const leaveService = require('../services/leaveService');
const { validateApplyLeave, validateApproveLeave } = require('../validators/leaveValidator');

class LeaveController {
    async apply(req, res, next) {
        try {
            const { error, value } = validateApplyLeave(req.body);
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const result = await leaveService.applyForLeave(req.user.id, value);
            res.status(201).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async approve(req, res, next) {
        try {
            const { error, value } = validateApproveLeave(req.body);
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const leaveId = req.params.id;
            const result = await leaveService.processLeaveApproval(leaveId, req.user.id, value);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LeaveController();
