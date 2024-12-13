import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './paymentStats.css';

const PaymentStats = () => {
  const monthlyData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1800 },
    { month: 'Mar', amount: 2200 },
    { month: 'Apr', amount: 1500 },
    { month: 'May', amount: 2800 },
    { month: 'Jun', amount: 2000 }
  ];

  const paymentMethodData = [
    { name: 'JazzCash', value: 50 },
    { name: 'EasyPaisa', value: 30 },
    { name: 'Bank', value: 20 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; // Colors for JazzCash, EasyPaisa, Bank

  return (
    <div className="payment-stats">
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="amount">PKR 11,500</p>
        </div>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p className="amount">PKR 2,000</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="amount">PKR 2,800</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h3>Monthly Spending</h3><br />
          <BarChart width={500} height={250} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-section">
          <h3>Payment Methods Distribution</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={paymentMethodData}
              cx={150}
              cy={125}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
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

export default PaymentStats;
