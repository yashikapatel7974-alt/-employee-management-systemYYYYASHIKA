---
marp: true
theme: default
paginate: true
---

# Enterprise Employee Management System
### Architecture, Deployment & Learning Outcomes
**Presented by**: [Your Name]

---

# Slide 1: Project Overview
**The Challenge**: Building an Enterprise-ready Human Resources platform that moves beyond simple CRUD operations to handle complex organizational logic.
**The Solution**: A full-stack application decoupling a robust Express.js/PostgreSQL backend from a responsive React frontend, connected via a REST API.

---

# Slide 2: Core Features
- **Centralized HR**: Paginated employee directory with profile management and avatar uploads.
- **Leave Workflow Engine**: Multi-tier leave requests with transactional database balance deduction.
- **Asset Allocation**: Track IT inventory lifecycle from procurement to return.
- **Role-Based Access Control (RBAC)**: Secure routing and endpoints managed via JWT.

---

# Slide 3: Tech Stack & Architecture
**Frontend**: React, Vite, Redux Toolkit, React Router, Recharts.
**Backend**: Node.js, Express, `pg`, JSON Web Tokens, `multer`.
**Database**: PostgreSQL featuring JSONB, Triggers, Views, and Procedures.
**DevOps**: Docker, Docker Compose, GitHub Actions.
**Hosting**: Vercel (Web), Render (API), Neon (DB).

---

# Slide 4: Advanced Database Design
*Moving beyond basic schemas:*
- **Atomic Transactions**: Ensured leave approvals and balance deductions succeed or fail together using `BEGIN`/`COMMIT`.
- **JSONB Auditing**: Implemented PostgreSQL Triggers to capture `OLD` and `NEW` object states, storing them as immutable JSON objects in an `audit_logs` table.
- **Views**: Abstracted complex joins across `Users` and `Profiles` into materialized logic.

---

# Slide 5: The Frontend Experience
- **Dynamic Routing**: Built `DashboardLayout` utilizing React Router for seamless Single Page Application transitions.
- **State Management**: Redux Toolkit acts as the single source of truth for Authentication.
- **Analytics**: Integrated `Recharts` to provide visual, real-time KPI metrics on Headcounts and Asset allocations.
- **Enterprise Aesthetics**: A clean, basic, and accessible Light Theme UI built with raw CSS.

---

# Slide 6: CI/CD & Deployment
- **GitHub Actions**: Automated testing pipeline running across multiple Node.js environments.
- **Render.yaml**: Infrastructure-as-code ensuring the backend securely reads `DATABASE_URL` and installs dependencies.
- **Vercel.json**: Rewriting routes to `index.html` to prevent 404 errors during client-side navigation.
- **CORS Configured**: API locked down to explicitly trust the live Vercel frontend.

---

# Slide 7: Challenges Overcome
1. **Nginx SPA Routing**: Overcame `404 Not Found` errors in Docker by writing custom Nginx fallback configs.
2. **State Syncing**: Fixed critical React `useState` array destructuring bugs that crashed dynamic forms.
3. **Complex Migrations**: Designing the `init.sql` script to correctly seed relational constraints and PL/pgSQL triggers from scratch.

---

# Slide 8: Future Roadmap
1. **OAuth 2.0 Integration**: One-click Google Workspace login.
2. **WebSocket Notifications**: Live, real-time alerts for Managers when a Leave is applied.
3. **Automated Twilio SMS**: Critical offline alerts connected to the existing `node-cron` scheduler.

---

# Slide 9: Learning Outcomes
- Mastered advanced PostgreSQL features (Transactions, JSONB Audits, Procedures).
- Gained deep insight into orchestrating multi-container environments using Docker Compose.
- Successfully bridged the gap between raw local development and automated cloud deployments using Vercel and Render.

---

# Slide 10: Thank You
### Questions & Answers
**Live Application**: `https://ems-frontend.vercel.app`
**GitHub Repository**: `https://github.com/yourusername/employee-management-system`
