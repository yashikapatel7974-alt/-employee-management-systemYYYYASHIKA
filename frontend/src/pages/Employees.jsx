import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useSelector } from 'react-redux';

const Employees = () => {
    const { token } = useSelector(state => state.auth);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || '';
                const res = await fetch(`${API_URL}/api/hr/employees`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if(data.success) setEmployees(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [token]);

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header">
                <h2><Users style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }}/> Employees Directory</h2>
                <button className="btn btn-primary">+ Add Employee</button>
            </div>
            
            <div className="glass-card">
                {loading ? <p>Loading employees...</p> : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? employees.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{emp.first_name} {emp.last_name}</td>
                                    <td style={{ padding: '1rem' }}>{emp.email}</td>
                                    <td style={{ padding: '1rem' }}>{emp.role}</td>
                                    <td style={{ padding: '1rem' }}>{emp.department_name || 'N/A'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No employees found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Employees;
