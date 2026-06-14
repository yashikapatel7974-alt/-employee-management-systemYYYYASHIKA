const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Example of a protected route to get current user info
router.get('/me', protect, (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});

module.exports = router;
