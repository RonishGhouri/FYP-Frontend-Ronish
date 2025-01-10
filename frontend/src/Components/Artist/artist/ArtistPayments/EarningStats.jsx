import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './earningStats.css';

const EarningStats = () => {
  // Monthly earnings data
  const monthlyEarnings = [
    { month: 'Jan', amount: 1500 },
    { month: 'Feb', amount: 2300 },
    { month: 'Mar', amount: 2700 },
    { month: 'Apr', amount: 1800 },
    { month: 'May', amount: 3200 },
    { month: 'Jun', amount: 2500 }
  ];

  // Payment methods distribution for received payments
  const paymentMethodData = [
    { name: 'JazzCash', value: 60 },
    { name: 'EasyPaisa', value: 25 },
    { name: 'Bank', value: 15 }
  ];

  const COLORS = ['#28a745', '#ffc107', '#007bff']; // Colors for JazzCash, EasyPaisa, Bank

  return (
    <div className="artist-earning-stats">
      <div className="artist-stats-summary">
        <div className="artist-stat-card">
          <h3>Total Earnings</h3>
          <p className="artist-amount">PKR 14,000</p>
        </div>
        <div className="artist-stat-card">
          <h3>Pending Payments</h3>
          <p className="artist-amount">PKR 3,000</p>
        </div>
        <div className="artist-stat-card">
          <h3>This Month</h3>
          <p className="artist-amount">PKR 3,200</p>
        </div>
      </div>

      <div className="artist-charts-container">
        <div className="artist-chart-section">
          <h3>Monthly Earnings</h3><br />
          <BarChart width={500} height={250} data={monthlyEarnings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#28a745" /> {/* Green color for earnings */}
          </BarChart>
        </div>

        <div className="artist-chart-section">
          <h3>Payment Methods Distribution</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={paymentMethodData}
              cx={150}
              cy={125}
              labelLine={false}
              outerRadius={80}
              fill="#28a745"
              dataKey="value"
            >
              {paymentMethodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default EarningStats;
