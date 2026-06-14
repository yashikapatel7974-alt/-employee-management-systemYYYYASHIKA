# Employee Management System

An enterprise-grade Employee Management System featuring comprehensive modules for Human Resources, Asset Allocation, Leave Workflow engines, and Data Analytics reporting.

## 🚀 Features
- **Core HR**: Comprehensive employee profiles, hierarchical department structuring, and secure file uploads for avatars.
- **Leave Workflow Engine**: Transactional leave application and approval engine with real-time balance deductions.
- **Asset Management**: Complete lifecycle tracking of IT inventory allocations and returns.
- **Role-Based Access Control (RBAC)**: Secure authentication via JWT, with modular `Admin`, `HR`, `Manager`, and `Employee` permission tiers.
- **Data Analytics Dashboard**: Visual integration via Recharts displaying KPI metrics (Headcount, Pending Leaves, Asset Distribution).
- **Audit Logging**: Asynchronous JSONB triggers automatically tracking state mutations across critical Postgres tables.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, React Router, Recharts, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, PostgreSQL (with `pg` driver), bcrypt, jsonwebtoken, multer, nodemailer, node-cron.
- **Infrastructure**: Docker, Docker Compose, GitHub Actions, Vercel (Frontend), Render (Backend), Neon (PostgreSQL).

## 📥 Installation

### Local Docker Environment
1. Clone the repository: `git clone https://github.com/yourusername/employee-management-system.git`
2. Navigate to the project directory: `cd employee-management-system`
3. Spin up the infrastructure: `docker-compose up -d --build`
4. Access the frontend at `http://localhost` and the backend at `http://localhost:5000`

### Local Node Environment
1. Ensure PostgreSQL is running locally on port `5432` and seed the database using `backend/init.sql`.
2. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌍 Deployment URLs
- **Frontend (Live)**: `https://ems-frontend.vercel.app` *(Placeholder)*
- **Backend API**: `https://ems-backend.onrender.com/api/health` *(Placeholder)*
- **Database**: `Neon PostgreSQL` *(Placeholder)*

## 👨‍💻 Developer
Developed by **[Your Developer Name Here]**
