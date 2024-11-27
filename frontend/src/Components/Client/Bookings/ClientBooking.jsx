import React, { useState } from 'react';
import './ClientBooking.css';
import ClientSidebar from '../sidebar/ClientSidebar';
import ClientHeader from '../header/ClientHeader';
import BookingManager from './BookingManager';

const initialBookingsData = [
  {
    id: 1,
    date: 'Wed, 28, Sep 2023',
    time: '09:00 - 09:30',
    eventName: '30min Consultation',
    location: 'Online',
    artist: { id: 1, name: 'Peer', profileUrl: '/artists/peer' },
    eventType: 'Corporate',
    notes: 'Prepare pitch for meeting',
    status: 'Upcoming',
  },
  {
    id: 2,
    date: 'Fri, 30, Sep 2023',
    time: '15:20 - 16:20',
    eventName: 'Product Launch',
    location: 'WeWork Paris',
    artist: { id: 2, name: 'Alice', profileUrl: '/artists/alice' },
    eventType: 'Private',
    notes: 'Special catering request',
    status: 'Pending',
    paymentRequired: true,
    confirmationStatus: 'Awaiting',
  },
  {
    id: 3,
    date: 'Mon, 2, Oct 2023',
    time: '10:00 - 11:00',
    eventName: 'Team Building Workshop',
    location: 'Zoom',
    artist: { id: 3, name: 'John', profileUrl: '/artists/john' },
    eventType: 'Corporate',
    notes: 'Discuss team roles and responsibilities.',
    status: 'Upcoming',
  },
];

const ClientBooking = () => {
  const [bookings, setBookings] = useState(initialBookingsData);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState('');

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBooking(null);
  };

  // Cancel booking handler
  const handleCancelBooking = () => {
    const updatedBooking = { ...selectedBooking, status: 'Cancelled' };
    setBookings((prev) =>
      prev.map((booking) => (booking.id === selectedBooking.id ? updatedBooking : booking))
    );
    setSelectedBooking(null);
    setNotification('Booking has been cancelled.');
  };

  // Payment handler
  const handlePayment = () => {
    const updatedBooking = { ...selectedBooking, status: 'Upcoming', paymentRequired: false };
    setBookings((prev) =>
      prev.map((booking) => (booking.id === selectedBooking.id ? updatedBooking : booking))
    );
    setSelectedBooking(null);
    setNotification('Payment successful. Booking confirmed!');
  };

  return (
    <div className="client-manage-dashboard">
      <ClientSidebar />
      <div className="client-main-content">
        <ClientHeader />
        <div className="client-manage-container">
          <h2>Manage Bookings</h2>
          {/* Tabs */}
          <div className="manage-tabs">
            {['Upcoming', 'Pending', 'Cancelled', 'Completed'].map((tab) => (
              <button
                key={tab}
                className={`manage-tab ${activeTab === tab ? 'manage-active-tab' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Booking Manager */}
          <BookingManager
            bookings={bookings.filter((booking) => booking.status === activeTab)}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            onCancelBooking={handleCancelBooking}
            onPayment={handlePayment}
          />
        </div>
        {/* Notification */}
        {notification && (
          <div className="notification">
            <p>{notification}</p>
            <button onClick={() => setNotification('')}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBooking;
