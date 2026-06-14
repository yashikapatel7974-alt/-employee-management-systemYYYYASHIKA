const express = require('express');
const hrController = require('../controllers/hrController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect); // All HR routes require authentication

router.get('/employees', authorize('Admin', 'HR', 'Manager'), hrController.getEmployees);
router.post('/avatar', upload.single('avatar'), hrController.uploadAvatar);

module.exports = router;
