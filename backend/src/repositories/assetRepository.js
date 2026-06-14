const db = require('../config/db');

class AssetRepository {
    async getAllAssets() {
        const query = 'SELECT * FROM assets ORDER BY created_at DESC';
        const result = await db.query(query);
        return result.rows;
    }

    async createAsset(assetTag, name, category, purchaseDate) {
        const query = `
            INSERT INTO assets (asset_tag, name, category, purchase_date)
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        const result = await db.query(query, [assetTag, name, category, purchaseDate]);
        return result.rows[0];
    }

    async allocateAsset(assetId, employeeId, allocatedDate, client) {
        // Update asset status
        await client.query("UPDATE assets SET status = 'Allocated' WHERE id = $1", [assetId]);
        
        // Create allocation record
        const query = `
            INSERT INTO asset_allocations (asset_id, employee_id, allocated_date)
            VALUES ($1, $2, $3) RETURNING *
        `;
        const result = await client.query(query, [assetId, employeeId, allocatedDate]);
        return result.rows[0];
    }

    async createAssetHistory(assetId, action, performedBy, notes, client) {
        const query = `
            INSERT INTO asset_history (asset_id, action, performed_by, notes)
            VALUES ($1, $2, $3, $4)
        `;
        await client.query(query, [assetId, action, performedBy, notes]);
    }
}

module.exports = new AssetRepository();
