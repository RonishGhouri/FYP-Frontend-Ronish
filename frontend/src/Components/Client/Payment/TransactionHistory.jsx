import React, { useState } from 'react';
import { format, subDays, subMonths, subYears, isAfter, isBefore } from 'date-fns';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions] = useState([
    {
      id: 1,
      date: new Date(),
      amount: 500,
      status: 'successful',
      eventName: 'Wedding Ceremony',
      paymentMethod: '**** 1234'
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000), // Yesterday
      amount: 300,
      status: 'pending',
      eventName: 'Birthday Party',
      paymentMethod: '**** 5678'
    },
    {
      id: 3,
      date: new Date(2023, 11, 24), // December 24, 2023
      amount: 1000,
      status: 'failed',
      eventName: 'Christmas Celebration',
      paymentMethod: '**** 7890'
    }
  ]);

  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: 'all'
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'successful':
        return 'status-success';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  const handleDownloadReceipt = (transaction) => {
    const receiptContent = `
      Receipt
      ============================================
      Event: ${transaction.eventName}
      Date: ${format(transaction.date, 'PPP')}
      Amount: PKR ${transaction.amount}
      Status: ${transaction.status}
      Payment Method: ${transaction.paymentMethod}
      ============================================
      Thank you for using our service!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${transaction.eventName.replace(/\s+/g, '_')}_Receipt.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const applyFilters = () => {
    const { status, dateRange } = filter;

    return transactions.filter((transaction) => {
      // Filter by status
      if (status !== 'all' && transaction.status !== status) {
        return false;
      }

      // Filter by date range
      if (dateRange !== 'all') {
        const now = new Date();
        let rangeStart;

        switch (dateRange) {
          case 'week':
            rangeStart = subDays(now, 7);
            break;
          case 'month':
            rangeStart = subMonths(now, 1);
            break;
          case 'year':
            rangeStart = subYears(now, 1);
            break;
          default:
            rangeStart = null;
        }

        if (rangeStart && isBefore(transaction.date, rangeStart)) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredTransactions = applyFilters();

  return (
    <div className="transaction-history">
      <div className="history-header">
        <h2>Transaction History</h2>
        <div className="filters">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filter.dateRange}
            onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <span className={`status ${getStatusClass(transaction.status)}`}>
                {transaction.status}
              </span>
              <div className="transaction-info">
                <div className="transaction-main">
                  <h3>{transaction.eventName}</h3>
                </div>
                <div className="transaction-details">
                  <p>Date: {format(transaction.date, 'PPP')}</p>
                  <p>Amount: PKR {transaction.amount}</p>
                  <p>Payment Method: {transaction.paymentMethod}</p>
                </div>
              </div>
              <button
                className="download-receipt"
                onClick={() => handleDownloadReceipt(transaction)}
              >
                Download Receipt
              </button>
            </div>
          ))
        ) : (
          <p>No transactions match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
