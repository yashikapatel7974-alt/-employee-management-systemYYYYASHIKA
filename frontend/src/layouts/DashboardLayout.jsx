import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LayoutDashboard, Users, Calendar, Laptop, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="dashboard-layout animate-fade-in">
            <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ padding: '0 1rem', marginBottom: '2rem' }}>Employee Management System</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <LayoutDashboard size={20} /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/employees" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <Users size={20} /> Employees
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/leaves" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <Calendar size={20} /> Leaves
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/assets" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <Laptop size={20} /> Assets
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div style={{ padding: '1rem' }}>
                    <button className="btn btn-outline" style={{ width: '100%', gap: '0.5rem' }} onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
