import React, { useState } from 'react';
import { format, subDays, subMonths, subYears, isBefore } from 'date-fns';
import './receivedHistory.css';

const ReceivedHistory = () => {
  // Sample data for received payments
  const [receivedPayments] = useState([
    {
      id: 1,
      date: new Date(),
      amount: 1500,
      status: 'successful',
      clientName: 'John Doe',
      paymentMethod: 'JazzCash'
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000), // Yesterday
      amount: 2300,
      status: 'pending',
      clientName: 'Jane Smith',
      paymentMethod: 'EasyPaisa'
    },
    {
      id: 3,
      date: new Date(2023, 11, 24), // December 24, 2023
      amount: 500,
      status: 'failed',
      clientName: 'Mike Johnson',
      paymentMethod: 'Bank Transfer'
    }
  ]);

  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: 'all'
  });

  // Status CSS classes
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

  // Function to generate and download receipt
  const handleDownloadReceipt = (payment) => {
    const receiptContent = `
      Receipt
      ============================================
      Client: ${payment.clientName}
      Date: ${format(payment.date, 'PPP')}
      Amount: PKR ${payment.amount}
      Status: ${payment.status}
      Payment Method: ${payment.paymentMethod}
      ============================================
      Thank you for your service!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${payment.clientName.replace(/\s+/g, '_')}_Receipt.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Apply filters for received payments
  const applyFilters = () => {
    const { status, dateRange } = filter;

    return receivedPayments.filter((payment) => {
      // Filter by status
      if (status !== 'all' && payment.status !== status) {
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

        if (rangeStart && isBefore(payment.date, rangeStart)) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredPayments = applyFilters();

  return (
    <div className="received-history">
      <div className="history-header">
        <h2>Received Payments History</h2>
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

      <div className="payments-list">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="payment-card">
              <span className={`status ${getStatusClass(payment.status)}`}>
                {payment.status}
              </span>
              <div className="payment-info">
                <div className="payment-main">
                  <h3>{payment.clientName}</h3>
                </div>
                <div className="payment-details">
                  <p>Date: {format(payment.date, 'PPP')}</p>
                  <p>Amount: PKR {payment.amount}</p>
                  <p>Payment Method: {payment.paymentMethod}</p>
                </div>
              </div>
              <button
                className="download-receipt"
                onClick={() => handleDownloadReceipt(payment)}
              >
                Download Receipt
              </button>
            </div>
          ))
        ) : (
          <p>No received payments match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ReceivedHistory;
