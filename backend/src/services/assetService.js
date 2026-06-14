const assetRepository = require('../repositories/assetRepository');
const db = require('../config/db');

class AssetService {
    async getAllAssets() {
        return await assetRepository.getAllAssets();
    }

    async createAsset(assetData) {
        const { assetTag, name, category, purchaseDate } = assetData;
        return await assetRepository.createAsset(assetTag, name, category, purchaseDate);
    }

    async allocateAsset(allocationData, performedByUserId) {
        const { assetId, employeeId, allocatedDate, notes } = allocationData;
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            const allocation = await assetRepository.allocateAsset(assetId, employeeId, allocatedDate, client);
            await assetRepository.createAssetHistory(assetId, 'Allocated', performedByUserId, notes, client);

            await client.query('COMMIT');
            return allocation;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new AssetService();
