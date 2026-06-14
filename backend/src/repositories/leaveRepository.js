const db = require('../config/db');

class LeaveRepository {
    async getLeaveBalance(employeeId, leaveTypeId, client = null) {
        const query = 'SELECT * FROM leave_balance WHERE employee_id = $1 AND leave_type_id = $2 FOR UPDATE';
        const connection = client || db;
        const result = await connection.query(query, [employeeId, leaveTypeId]);
        return result.rows[0];
    }

    async createLeaveApplication(employeeId, leaveTypeId, startDate, endDate, reason, client = null) {
        const query = `
            INSERT INTO leave_applications (employee_id, leave_type_id, start_date, end_date, reason)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const connection = client || db;
        const result = await connection.query(query, [employeeId, leaveTypeId, startDate, endDate, reason]);
        return result.rows[0];
    }

    async getLeaveApplicationById(leaveId, client = null) {
        const query = 'SELECT * FROM leave_applications WHERE id = $1 FOR UPDATE';
        const connection = client || db;
        const result = await connection.query(query, [leaveId]);
        return result.rows[0];
    }

    async updateLeaveApplicationStatus(leaveId, status, client) {
        const query = 'UPDATE leave_applications SET status = $1 WHERE id = $2 RETURNING *';
        const result = await client.query(query, [status, leaveId]);
        return result.rows[0];
    }

    async updateLeaveBalance(employeeId, leaveTypeId, usedDays, client) {
        const query = `
            UPDATE leave_balance 
            SET used_days = used_days + $1 
            WHERE employee_id = $2 AND leave_type_id = $3
        `;
        await client.query(query, [usedDays, employeeId, leaveTypeId]);
    }

    async createApprovalHistory(leaveId, approverId, action, comments, client) {
        const query = `
            INSERT INTO approval_history (leave_application_id, approver_id, action, comments)
            VALUES ($1, $2, $3, $4)
        `;
        await client.query(query, [leaveId, approverId, action, comments]);
    }
}

module.exports = new LeaveRepository();
