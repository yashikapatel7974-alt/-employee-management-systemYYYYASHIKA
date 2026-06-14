const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Admin', 'HR', 'Manager', 'Employee').optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfJoining: Joi.date().iso().required(),
    salary: Joi.number().positive().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validateRegistration = (data) => registerSchema.validate(data);
const validateLogin = (data) => loginSchema.validate(data);

module.exports = { validateRegistration, validateLogin };
