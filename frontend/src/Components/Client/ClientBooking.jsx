import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientBooking.css';
import ClientSidebar from './sidebar/ClientSidebar';
import ClientHeader from './header/ClientHeader';
import PaymentPopup from './PaymentPopup';

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
  {
    id: 4,
    date: 'Wed, 4, Oct 2023',
    time: '14:00 - 15:00',
    eventName: 'Music Lessons',
    location: 'Client Studio, Berlin',
    artist: { id: 4, name: 'Emily', profileUrl: '/artists/emily' },
    eventType: 'Private',
    notes: 'Focus on guitar and vocal training.',
    status: 'Pending',
    paymentRequired: true,
    confirmationStatus: 'Confirmed',
  },
  {
    id: 5,
    date: 'Sat, 7, Oct 2023',
    time: '16:00 - 18:00',
    eventName: 'Wedding Ceremony',
    location: 'Greenwood Park, NYC',
    artist: { id: 5, name: 'Sophia', profileUrl: '/artists/sophia' },
    eventType: 'Private',
    notes: 'Rehearse 3 wedding songs.',
    status: 'Completed',
  },
  {
    id: 6,
    date: 'Sun, 8, Oct 2023',
    time: '19:00 - 21:00',
    eventName: 'Jazz Night',
    location: 'The Jazz Club, London',
    artist: { id: 6, name: 'Mike', profileUrl: '/artists/mike' },
    eventType: 'Corporate',
    notes: 'Setlist includes classic jazz standards.',
    status: 'Upcoming',
  },
  {
    id: 7,
    date: 'Tue, 10, Oct 2023',
    time: '13:00 - 14:00',
    eventName: 'Podcast Recording',
    location: 'Online',
    artist: { id: 7, name: 'Jane', profileUrl: '/artists/jane' },
    eventType: 'Corporate',
    notes: 'Discuss topics for upcoming podcast series.',
    status: 'Cancelled',
  },
];

const ClientBooking = () => {
  const [bookings, setBookings] = useState(initialBookingsData);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState('');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBooking(null);
  };

  const handleCancelBooking = () => {
    const updatedBooking = { ...selectedBooking, status: 'Cancelled' };
    setBookings((prev) =>
      prev.map((booking) => (booking.id === selectedBooking.id ? updatedBooking : booking))
    );
    setSelectedBooking(null);
    setNotification('Booking has been cancelled.');
  };

  const handlePayment = () => {
    setShowPaymentPopup(true);
  };

  const handleConfirmPayment = () => {
    const updatedBooking = { ...selectedBooking, status: 'Upcoming', paymentRequired: false };
    setBookings((prev) =>
      prev.map((booking) => (booking.id === selectedBooking.id ? updatedBooking : booking))
    );
    setSelectedBooking(null);
    setShowPaymentPopup(false);
    setNotification('Payment successful. Booking confirmed!');
  };

  const navigateToArtistProfile = (url) => {
    navigate(url);
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
          {/* Booking List */}
          <div className="manage-list">
            {bookings.filter((booking) => booking.status === activeTab).length === 0 ? (
              <p className="empty-message">No bookings available for this status.</p>
            ) : (
              bookings
                .filter((booking) => booking.status === activeTab)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="manage-item"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="manage-date">{booking.date}</div>
                    <div className="manage-info">
                      <h4>{booking.eventName}</h4>
                      <p>Artist: {booking.artist.name}</p>
                      <p>Location: {booking.location}</p>
                      <p>Event Type: {booking.eventType}</p>
                      <p>
                        Confirmation Status:{' '}
                        {booking.confirmationStatus
                          ? booking.confirmationStatus
                          : booking.status}
                      </p>
                    </div>
                    <div className="manage-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToArtistProfile(booking.artist.profileUrl);
                        }}
                      >
                        View Artist
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Modal for Booking Actions */}
          {selectedBooking && (
            <div className="manage-modal" onClick={() => setSelectedBooking(null)}>
              <div className="manage-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{selectedBooking.eventName}</h3>
                <p>Date: {selectedBooking.date}</p>
                <p>Time: {selectedBooking.time}</p>
                <p>Location: {selectedBooking.location}</p>
                <p>Artist: {selectedBooking.artist.name}</p>
                <p>Notes: {selectedBooking.notes}</p>
                <div className="modal-actions">
                  {selectedBooking.status === 'Pending' &&
                    selectedBooking.confirmationStatus === 'Confirmed' &&
                    selectedBooking.paymentRequired && (
                      <button onClick={handlePayment}>Make Payment</button>
                    )}
                  {selectedBooking.status === 'Pending' &&
                    selectedBooking.confirmationStatus !== 'Confirmed' && (
                      <p>Awaiting artist confirmation</p>
                    )}
                  {selectedBooking.status === 'Pending' && (
                    <button onClick={handleCancelBooking}>Cancel Booking</button>
                  )}
                  <button onClick={() => setSelectedBooking(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Popup */}
          {showPaymentPopup && selectedBooking && (
            <PaymentPopup
              booking={selectedBooking}
              onClose={() => setShowPaymentPopup(false)}
              onConfirm={handleConfirmPayment}
            />
          )}
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
