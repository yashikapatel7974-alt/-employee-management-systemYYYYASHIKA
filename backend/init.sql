-- Schema for Enterprise Employee Management System

-- Set timezone
SET TIMEZONE="UTC";

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Role Based)
CREATE TYPE user_role AS ENUM ('Admin', 'HR', 'Manager', 'Employee');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'Employee',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Profiles
CREATE TABLE employee_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url TEXT,
    date_of_joining DATE NOT NULL,
    salary NUMERIC(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Employee Skills (Many-to-Many)
CREATE TABLE employee_skills (
    employee_id INTEGER REFERENCES employee_profiles(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (employee_id, skill_id)
);

-- Leave Types
CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    default_days INTEGER NOT NULL
);

-- Leave Balance
CREATE TABLE leave_balance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employee_profiles(id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(id) ON DELETE CASCADE,
    total_allocated INTEGER NOT NULL,
    used_days INTEGER DEFAULT 0,
    UNIQUE(employee_id, leave_type_id)
);

-- Leave Applications
CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected', 'Cancelled');

CREATE TABLE leave_applications (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employee_profiles(id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status leave_status DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approval History
CREATE TABLE approval_history (
    id SERIAL PRIMARY KEY,
    leave_application_id INTEGER REFERENCES leave_applications(id) ON DELETE CASCADE,
    approver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action leave_status NOT NULL,
    comments TEXT,
    acted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets
CREATE TYPE asset_status AS ENUM ('Available', 'Allocated', 'Maintenance', 'Retired');

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    purchase_date DATE,
    status asset_status DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Allocations
CREATE TABLE asset_allocations (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INTEGER REFERENCES employee_profiles(id) ON DELETE CASCADE,
    allocated_date DATE NOT NULL,
    return_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset History
CREATE TABLE asset_history (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'Allocated', 'Returned', 'Maintenance'
    performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs (JSONB)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_data JSONB,
    new_data JSONB,
    changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Triggers and Functions
-- ==========================================

-- Function for updating `updated_at` column
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER trg_employee_profiles_updated
BEFORE UPDATE ON employee_profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER trg_leave_applications_updated
BEFORE UPDATE ON leave_applications
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Audit Log Trigger Function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, v_old_data, v_new_data);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
        INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, v_old_data, NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        v_new_data := to_jsonb(NEW);
        INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, NULL, v_new_data);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply Audit Triggers to Critical Tables
CREATE TRIGGER trg_audit_assets
AFTER INSERT OR UPDATE OR DELETE ON assets
FOR EACH ROW EXECUTE PROCEDURE log_audit_event();

CREATE TRIGGER trg_audit_employee_profiles
AFTER INSERT OR UPDATE OR DELETE ON employee_profiles
FOR EACH ROW EXECUTE PROCEDURE log_audit_event();


-- ==========================================
-- Views
-- ==========================================

-- Employee Details View (Combines User, Profile, Department)
CREATE OR REPLACE VIEW employee_details_view AS
SELECT 
    ep.id AS employee_profile_id,
    u.id AS user_id,
    u.email,
    u.role,
    u.is_active,
    ep.first_name,
    ep.last_name,
    ep.phone_number,
    ep.date_of_joining,
    d.name AS department_name,
    m.first_name AS manager_first_name,
    m.last_name AS manager_last_name
FROM 
    employee_profiles ep
JOIN users u ON ep.user_id = u.id
LEFT JOIN departments d ON ep.department_id = d.id
LEFT JOIN employee_profiles m ON ep.manager_id = m.user_id;

-- Dashboard: Pending Leaves View
CREATE OR REPLACE VIEW pending_leaves_view AS
SELECT 
    la.id AS leave_application_id,
    ep.first_name,
    ep.last_name,
    lt.name AS leave_type,
    la.start_date,
    la.end_date,
    la.reason,
    la.applied_at
FROM 
    leave_applications la
JOIN employee_profiles ep ON la.employee_id = ep.id
JOIN leave_types lt ON la.leave_type_id = lt.id
WHERE 
    la.status = 'Pending';


-- ==========================================
-- Stored Procedures
-- ==========================================

-- Stored Procedure to Initialize Leave Balance for new employee
CREATE OR REPLACE PROCEDURE allocate_initial_leave_balance(p_employee_id INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    v_leave_type RECORD;
BEGIN
    FOR v_leave_type IN SELECT id, default_days FROM leave_types LOOP
        INSERT INTO leave_balance (employee_id, leave_type_id, total_allocated, used_days)
        VALUES (p_employee_id, v_leave_type.id, v_leave_type.default_days, 0)
        ON CONFLICT (employee_id, leave_type_id) DO NOTHING;
    END LOOP;
END;
$$;
