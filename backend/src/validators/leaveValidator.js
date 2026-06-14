const Joi = require('joi');

const applyLeaveSchema = Joi.object({
    leaveTypeId: Joi.number().integer().positive().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    reason: Joi.string().min(10).required()
});

const approveLeaveSchema = Joi.object({
    action: Joi.string().valid('Approved', 'Rejected').required(),
    comments: Joi.string().optional()
});

const validateApplyLeave = (data) => applyLeaveSchema.validate(data);
const validateApproveLeave = (data) => approveLeaveSchema.validate(data);

module.exports = { validateApplyLeave, validateApproveLeave };
