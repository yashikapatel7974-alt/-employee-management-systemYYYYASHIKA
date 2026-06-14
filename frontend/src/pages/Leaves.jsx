import React from 'react';
import { Calendar } from 'lucide-react';

const Leaves = () => {
    return (
        <div className="animate-fade-in">
            <div className="dashboard-header">
                <h2><Calendar style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }}/> Leave Management</h2>
                <button className="btn btn-primary">Apply for Leave</button>
            </div>
            
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                <Calendar size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>No Leave Applications</h3>
                <p>You have no pending or past leave applications.</p>
            </div>
        </div>
    );
};

export default Leaves;
