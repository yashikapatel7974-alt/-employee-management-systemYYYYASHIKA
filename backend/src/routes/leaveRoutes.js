const express = require('express');
const leaveController = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All leave routes require authentication

router.post('/apply', leaveController.apply);

// Only HR, Manager, and Admin can approve leaves
router.post('/:id/approve', authorize('HR', 'Manager', 'Admin'), leaveController.approve);

module.exports = router;
