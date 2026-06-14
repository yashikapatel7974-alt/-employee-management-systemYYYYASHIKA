const leaveRepository = require('../repositories/leaveRepository');
const db = require('../config/db');

class LeaveService {
    async applyForLeave(userId, leaveData) {
        const { leaveTypeId, startDate, endDate, reason } = leaveData;

        // Fetch employee profile ID based on user_id (Mock implementation assuming 1:1 mapping for simplicity or a fetch function)
        // In reality, we would query employee_profiles table to get employee_id from user_id.
        const employeeQuery = await db.query('SELECT id FROM employee_profiles WHERE user_id = $1', [userId]);
        const employeeId = employeeQuery.rows[0].id;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const requestedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const balance = await leaveRepository.getLeaveBalance(employeeId, leaveTypeId);
        if (!balance) {
            const err = new Error('Leave balance record not found');
            err.statusCode = 404;
            throw err;
        }

        if (balance.total_allocated - balance.used_days < requestedDays) {
            const err = new Error('Insufficient leave balance');
            err.statusCode = 400;
            throw err;
        }

        return await leaveRepository.createLeaveApplication(employeeId, leaveTypeId, startDate, endDate, reason);
    }

    async processLeaveApproval(leaveId, approverUserId, actionData) {
        const { action, comments } = actionData;
        const client = await db.getClient();

        try {
            await client.query('BEGIN'); // Start Transaction

            const application = await leaveRepository.getLeaveApplicationById(leaveId, client);
            if (!application) {
                const err = new Error('Leave application not found');
                err.statusCode = 404;
                throw err;
            }

            if (application.status !== 'Pending') {
                const err = new Error(`Application is already ${application.status}`);
                err.statusCode = 400;
                throw err;
            }

            // Update status
            const updatedApp = await leaveRepository.updateLeaveApplicationStatus(leaveId, action, client);

            if (action === 'Approved') {
                const start = new Date(application.start_date);
                const end = new Date(application.end_date);
                const requestedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                
                // Deduct balance
                await leaveRepository.updateLeaveBalance(application.employee_id, application.leave_type_id, requestedDays, client);
            }

            // Log Approval History
            await leaveRepository.createApprovalHistory(leaveId, approverUserId, action, comments, client);

            await client.query('COMMIT'); // Commit Transaction
            
            // TODO: Trigger Notification Event here

            return updatedApp;
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback on any failure
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new LeaveService();
