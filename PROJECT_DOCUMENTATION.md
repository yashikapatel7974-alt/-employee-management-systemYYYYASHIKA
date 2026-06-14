# Employee Management System - Project Documentation

## 1. Project Overview
The Employee Management System (EMS) is a full-stack, enterprise-grade web application built to streamline Human Resource operations. It provides centralized control over employee data, leave application workflows, and IT asset allocations. Built to scale, the system leverages a robust relational database with advanced auditing, a decoupled RESTful backend API, and a reactive Single Page Application frontend.

## 2. Core Modules
### Authentication & RBAC
- Implements JWT-based stateless authentication.
- Passwords are securely hashed using `bcrypt`.
- Role-Based Access Control (RBAC) securely gates endpoints depending on user tier (`Admin`, `HR`, `Manager`, `Employee`).

### Core HR
- Stores hierarchical employee data mapped to Departments and Managers.
- Integrates `multer` for secure, multi-part form data uploads for employee avatars.
- Paginated endpoints for efficient data retrieval.

### Leave Workflow Engine
- Employees can apply for specific leave types (Sick, Vacation, Unpaid).
- Managers can approve/reject workflows.
- Approvals trigger atomic PostgreSQL transactions ensuring Leave Balance deductions and Application Status updates occur reliably without data corruption.

### Asset Management
- Tracks the full lifecycle of IT inventory from 'Available' to 'Allocated' and 'Retired'.
- Links devices directly to Employee Profiles and logs allocation history.

## 3. Database Design
The system utilizes **PostgreSQL** capitalizing on relational integrity and advanced features:
- **Foreign Key Constraints** with `ON DELETE CASCADE` and `SET NULL` policies ensure orphaned records do not exist.
- **Views**: Utilized `employee_details_view` to abstract complex JOIN operations across Users, Profiles, and Departments.
- **Stored Procedures**: Deployed `allocate_initial_leave_balance` to programmatically seed newly onboarded employees with default allocations.
- **JSONB Audit Triggers**: Critical tables (`assets`, `employee_profiles`) have automated triggers that inject historical `OLD` and `NEW` object states directly into an `audit_logs` table using Postgres JSONB indexing.

## 4. Key API Endpoints
| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | Public | Authenticates user and returns JWT |
| `/api/auth/register` | POST | Public | Registers a new employee user account |
| `/api/hr/employees` | GET | Admin, HR, Manager | Retrieves paginated employee directory |
| `/api/leaves/apply` | POST | Employee | Submits a new leave request |
| `/api/leaves/:id/approve` | PUT | Admin, HR, Manager | Approves/Rejects leave and deducts balance |
| `/api/assets` | GET | Admin, HR | Retrieves IT asset inventory |
| `/api/health` | GET | Public | Validates backend uptime (`{"status": "UP"}`) |

## 5. Deployment Infrastructure
The system is built for modular deployment leveraging modern cloud infrastructure:
- **Database**: Hosted on **Neon Serverless PostgreSQL**, allowing connection pooling and instant scaling.
- **Backend API**: Deployed on **Render** utilizing `render.yaml` infrastructure-as-code for automated `npm install` and `npm start` triggers based on GitHub webhooks.
- **Frontend SPA**: Deployed on **Vercel** with integrated Edge caching. Vercel automatically routes the React single-page application using `vercel.json` rewrites.
- **CI/CD**: A comprehensive GitHub Actions pipeline validates `Node.js` integration tests across multiple matrix versions upon every pull request.

**Deployment URLs:**
- **Frontend**: `https://frontend-pi-olive-29.vercel.app`
- **Backend API**: `https://employee-management-systemyyyyashika.onrender.com`

## 6. Screenshots & Verification
*(Attach Screenshots Here)*
1. Login View
2. Dashboard Overview with Recharts
3. Employee Directory

## 7. Future Enhancements
- Integrate OAuth 2.0 (Google/Microsoft) for single sign-on capabilities.
- Implement WebSockets (`socket.io`) for real-time manager notifications when leaves are requested.
- Connect the existing `node-cron` scheduler to a third-party SMS provider (Twilio) for urgent offline alerts.
