import React from 'react';
import { Laptop } from 'lucide-react';

const Assets = () => {
    return (
        <div className="animate-fade-in">
            <div className="dashboard-header">
                <h2><Laptop style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }}/> Asset Inventory</h2>
                <button className="btn btn-primary">Allocate Asset</button>
            </div>
            
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                <Laptop size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>No Assets Found</h3>
                <p>There are no IT assets allocated to you currently.</p>
            </div>
        </div>
    );
};

export default Assets;
