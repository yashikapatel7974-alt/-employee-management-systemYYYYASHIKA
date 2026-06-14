const assetService = require('../services/assetService');

class AssetController {
    async getAllAssets(req, res, next) {
        try {
            const assets = await assetService.getAllAssets();
            res.status(200).json({ success: true, count: assets.length, data: assets });
        } catch (error) {
            next(error);
        }
    }

    async createAsset(req, res, next) {
        try {
            const asset = await assetService.createAsset(req.body);
            res.status(201).json({ success: true, data: asset });
        } catch (error) {
            next(error);
        }
    }

    async allocateAsset(req, res, next) {
        try {
            const allocation = await assetService.allocateAsset(req.body, req.user.id);
            res.status(200).json({ success: true, data: allocation });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AssetController();
