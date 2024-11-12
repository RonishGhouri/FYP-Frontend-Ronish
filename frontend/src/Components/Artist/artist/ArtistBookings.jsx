import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArtistBookings.css';
import ArtistSidebar from './sidebar/ArtistSidebar';
import ArtistHeader from './header/ArtistHeader';

const initialBookingsData = [
  {
    id: 1,
    date: 'Wed, 28, Sep 2023',
    time: '09:00 - 09:30',
    eventName: '30min call meeting Peer ↔ Leslie',
    location: 'Online',
    requester: { id: 1, name: 'Peer', email: 'peer@example.com', phone: '123-456-7890' },
    eventType: 'Corporate',
    notes: 'Bring own projector',
    status: 'Upcoming',
  },
  {
    id: 2,
    date: 'Fri, 30, Sep 2023',
    time: '15:20 - 16:20',
    eventName: 'Product Demo',
    location: 'WeWork Paris, France',
    requester: { id: 2, name: 'Alice', email: 'alice@example.com', phone: '987-654-3210' },
    eventType: 'Private Party',
    notes: 'Client prefers a small, intimate setup.',
    status: 'Pending',
  },
  {
    id: 3,
    date: 'Sat, 14, Dec 2021',
    time: '15:20 - 16:20',
    eventName: 'Mehndi',
    location: 'WeWork Paris, France',
    requester: { id: 3, name: 'Darbari', email: 'darbari@example.com', phone: '987-654-3210' },
    eventType: 'Private Party',
    notes: 'Client prefers a small, intimate setup.',
    status: 'Pending',
  }
  // Add other bookings as needed
];

const ArtistBookings = () => {
  const [bookings, setBookings] = useState(initialBookingsData);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [showDropdown, setShowDropdown] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowDropdown(null);
    setSelectedBooking(null);
  };

  const toggleDropdown = (id) => {
    setShowDropdown((prev) => (prev === id ? null : id));
  };

  const downloadSummary = (booking) => {
    const summary = `Booking Summary:\n\nEvent: ${booking.eventName}\nDate: ${booking.date}\nTime: ${booking.time}\nLocation: ${booking.location}\nType of Event: ${booking.eventType}\nBooking Notes: ${booking.notes}\nRequester: ${booking.requester.name}, ${booking.requester.email}, ${booking.requester.phone}`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'booking_summary.txt';
    link.click();
  };

  const approveBooking = (booking) => {
    const updatedBooking = { ...booking, status: 'Upcoming' };
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === booking.id ? updatedBooking : b))
    );
    setSelectedBooking(null);
    setActiveTab('Upcoming');
  };

  const handleCancelBooking = () => {
    const updatedBooking = { ...selectedBooking, status: 'Cancelled' };
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === selectedBooking.id ? updatedBooking : b))
    );
    console.log(`Notification sent to ${selectedBooking.requester.name} with reason: ${cancelReason}`);
    setShowCancelReasonModal(false);
    setSelectedBooking(null);
    setCancelReason('');
    setActiveTab('Cancelled');
  };

  const openChatWithClient = (client) => {
    navigate('/artist/chats', { state: { client } });
  };

  const markAsCompleted = (booking) => {
    const updatedBooking = { ...booking, status: 'Completed' };
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === booking.id ? updatedBooking : b))
    );
    setSelectedBooking(null);
    setActiveTab('Completed');
  };

  const submitFeedback = () => {
    console.log(`Feedback for booking ${selectedBooking.eventName}: ${feedback}`);
    setFeedback('');
    setShowFeedbackModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="artist-dashboard-container">
      <ArtistSidebar />

      <div className="artist-main-container">
        <ArtistHeader />

        <div className="artist-bookings-section">
          <h2>Bookings</h2>
          <p>See your scheduled events from your calendar events links.</p>

          <div className="bookings-tabs">
            {['Upcoming', 'Pending', 'Past', 'Cancelled', 'Completed'].map((tab) => (
              <button
                key={tab}
                className={`bookings-tab ${activeTab === tab ? 'active-tab' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bookings-list">
            {bookings
              .filter((booking) => booking.status === activeTab)
              .map((booking) => (
                <div
                  key={booking.id}
                  className="bookings-item"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="bookings-date">{booking.date}</div>
                  <div className="bookings-info">
                    <p className="bookings-time">{booking.time}</p>
                    <p className="bookings-name">{booking.eventName}</p>
                    <p className="bookings-location">{booking.location}</p>
                  </div>
                  <div className="bookings-actions">
                    <button onClick={(e) => { e.stopPropagation(); toggleDropdown(booking.id); }}>
                      Edit
                    </button>
                    {showDropdown === booking.id && (
                      <div className="bookings-dropdown-menu">
                        <p onClick={() => console.log('Reschedule booking')}>Reschedule booking</p>
                        <p onClick={() => console.log('Request reschedule')}>Request reschedule</p>
                        <p onClick={() => console.log('Edit location')}>Edit location</p>
                        <p onClick={() => console.log('Invite people')}>Invite people</p>
                        <p onClick={() => console.log('Cancel event')}>Cancel event</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {selectedBooking && (
            <div className="bookings-detail-modal" onClick={() => setSelectedBooking(null)}>
              <div className="bookings-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{selectedBooking.eventName}</h3>
                <p>Date: {selectedBooking.date}</p>
                <p>Time: {selectedBooking.time}</p>
                <p>Location: {selectedBooking.location}</p>
                <p>Type of Event: {selectedBooking.eventType}</p>
                <p>Booking Notes: {selectedBooking.notes}</p>
                <p>Status: {selectedBooking.status}</p>
                <p>Requester: {selectedBooking.requester.name}, {selectedBooking.requester.email}, {selectedBooking.requester.phone}</p>
                <div className="bookings-modal-actions">
                  <button onClick={() => downloadSummary(selectedBooking)}>Download Summary</button>
                  {selectedBooking.status === 'Pending' && (
                    <>
                      <button onClick={() => approveBooking(selectedBooking)}>Approve</button>
                      <button onClick={() => setShowCancelReasonModal(true)}>Cancel</button>
                      <button onClick={() => openChatWithClient(selectedBooking.requester)}>Chat</button>
                    </>
                  )}
                  {selectedBooking.status === 'Upcoming' && (
                    <>
                      <button onClick={() => markAsCompleted(selectedBooking)}>Mark as Completed</button>
                      <button onClick={() => setShowFeedbackModal(true)}>Leave Feedback</button>
                    </>
                  )}
                  <button onClick={() => setSelectedBooking(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {showCancelReasonModal && (
            <div className="cancel-reason-modal" onClick={() => setShowCancelReasonModal(false)}>
              <div className="cancel-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Cancel Booking</h3>
                <p>Please provide a reason for cancellation:</p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason..."
                  rows="4"
                ></textarea>
                <div className="modal-actions">
                  <button onClick={handleCancelBooking}>Submit</button>
                  <button onClick={() => setShowCancelReasonModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {showFeedbackModal && (
            <div className="feedback-modal" onClick={() => setShowFeedbackModal(false)}>
              <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Leave Feedback</h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter feedback for future reference..."
                  rows="4"
                ></textarea>
                <div className="modal-actions">
                  <button onClick={submitFeedback}>Submit</button>
                  <button onClick={() => setShowFeedbackModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistBookings;
