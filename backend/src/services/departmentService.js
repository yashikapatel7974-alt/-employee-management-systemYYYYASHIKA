const NodeCache = require('node-cache');
const db = require('../config/db');

// Cache departments for 24 hours since they rarely change
const departmentCache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

class DepartmentService {
    async getAllDepartments() {
        const cacheKey = 'departments_all';
        const cachedDeps = departmentCache.get(cacheKey);

        if (cachedDeps) {
            return cachedDeps;
        }

        const query = 'SELECT * FROM departments ORDER BY name ASC';
        const result = await db.query(query);

        departmentCache.set(cacheKey, result.rows);
        return result.rows;
    }

    clearCache() {
        departmentCache.del('departments_all');
    }
}

module.exports = new DepartmentService();
