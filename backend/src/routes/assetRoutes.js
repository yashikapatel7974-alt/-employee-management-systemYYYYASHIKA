const express = require('express');
const assetController = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'HR', 'Manager'), assetController.getAllAssets);
router.post('/', authorize('Admin', 'HR'), assetController.createAsset);
router.post('/allocate', authorize('Admin', 'HR', 'Manager'), assetController.allocateAsset);

module.exports = router;
