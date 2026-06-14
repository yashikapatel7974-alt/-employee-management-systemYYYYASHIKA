import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, Laptop } from 'lucide-react';
import { exportToExcel } from '../utils/exportUtils';

const mockLeaveData = [
  { name: 'Pending', value: 15 },
  { name: 'Approved', value: 45 },
  { name: 'Rejected', value: 5 }
];

const mockDepartmentData = [
  { name: 'Engineering', employees: 45 },
  { name: 'HR', employees: 8 },
  { name: 'Sales', employees: 20 },
  { name: 'Marketing', employees: 12 }
];

const COLORS = ['#f59e0b', '#10b981', '#ef4444'];

const Dashboard = () => {
  const handleExport = () => {
    exportToExcel(mockDepartmentData, 'department_stats.xlsx');
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h2>Overview</h2>
        <button className="btn btn-primary" onClick={handleExport}>Export Report (XLSX)</button>
      </div>

      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <span className="metric-title"><Users size={16} /> Total Employees</span>
          <span className="metric-value">1,245</span>
        </div>
        <div className="glass-card metric-card">
          <span className="metric-title"><Calendar size={16} /> Pending Leaves</span>
          <span className="metric-value">15</span>
        </div>
        <div className="glass-card metric-card">
          <span className="metric-title"><Laptop size={16} /> Allocated Assets</span>
          <span className="metric-value">842</span>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="glass-card" style={{ height: '350px' }}>
          <h3>Employees by Department</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDepartmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)' }} />
              <Bar dataKey="employees" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ height: '350px' }}>
          <h3>Leave Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockLeaveData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {mockLeaveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
