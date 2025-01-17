import React, { useState } from 'react';
import './Filter.css'; // Import CSS for filter styles

const Filter = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [paymentStatus, setPaymentStatus] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    setDateRange({ ...dateRange, [event.target.name]: event.target.value });
  };

  const handlePaymentStatusChange = (event) => {
    setPaymentStatus(event.target.value);
  };

  const applyFilters = () => {
    // Pass filters to parent component for processing
    onApplyFilters({ selectedStatus, dateRange, paymentStatus });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedStatus('');
    setDateRange({ start: '', end: '' });
    setPaymentStatus('');
    onApplyFilters({ selectedStatus: '', dateRange: { start: '', end: '' }, paymentStatus: '' });
  };

  return (
    <div className={`filter-container ${isOpen ? 'open' : ''}`}>
      <button className="filter-btn" onClick={toggleDropdown}>
        <i className="fas fa-filter"></i> Filter
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <h3>Filter Events</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
          </div>

          {/* Filter Options */}
          <div className="filter-section">
            <div className="filter-category">
              <h4>Status Filter</h4>
              <select value={selectedStatus} onChange={handleStatusChange}>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="filter-category">
              <h4>Date Range</h4>
              <div className="date-range">
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  placeholder="End Date"
                />
              </div>
            </div>

            <div className="filter-category">
              <h4>Payment Status</h4>
              <select value={paymentStatus} onChange={handlePaymentStatusChange}>
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="apply-btn" onClick={applyFilters}>Apply Filters</button>
            <button className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
