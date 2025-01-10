import React, { useState } from 'react';
import './ArtistFilter.css'; // Change the CSS file to use artist-specific styles

const ArtistFilter = () => {
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
    // Logic to apply the filters (you can pass them to a parent component or update the state)
    console.log('Filters applied:', { selectedStatus, dateRange, paymentStatus });
    setIsOpen(false);
  };

  return (
    <div className={`artist-filter-container ${isOpen ? 'open' : ''}`}>
      <button className="artist-filter-btn" onClick={toggleDropdown}>
        <i className="fas fa-filter"></i> Filter
      </button>

      {isOpen && (
        <div className="artist-filter-dropdown">
          {/* Filter Title and Close Button */}
          <div className="artist-filter-header">
            <h3>Filter Events</h3>
            <button className="artist-close-btn" onClick={() => setIsOpen(false)}>X</button>
          </div>

          {/* Filter Sections */}
          <div className="artist-filter-section">
            <div className="artist-filter-category">
              <h4>Status Filter</h4>
              <select value={selectedStatus} onChange={handleStatusChange}>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="artist-filter-category">
              <h4>Date Range</h4>
              <div className="artist-date-range">
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

            <div className="artist-filter-category">
              <h4>Payment Status</h4>
              <select value={paymentStatus} onChange={handlePaymentStatusChange}>
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="artist-filter-actions">
            <button className="artist-apply-btn" onClick={applyFilters}>Apply Filters</button>
            <button className="artist-reset-btn" onClick={() => {
              setSelectedStatus('');
              setDateRange({ start: '', end: '' });
              setPaymentStatus('');
            }}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistFilter;
