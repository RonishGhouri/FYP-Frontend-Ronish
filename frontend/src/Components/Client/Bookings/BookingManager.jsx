import React from 'react';
import './BookingManager.css';

const BookingManager = ({
  bookings,
  selectedBooking,
  setSelectedBooking,
  onCancelBooking,
  onPayment,
}) => {
  return (
    <div>
      {/* Booking List */}
      <div className="manage-list">
        {bookings.length === 0 ? (
          <p className="empty-message">No bookings available for this status.</p>
        ) : (
          bookings.map((booking) => (
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
                <p>Confirmation Status: {booking.confirmationStatus || booking.status}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
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
                  <button onClick={onPayment}>Make Payment</button>
                )}
              {selectedBooking.status === 'Pending' &&
                selectedBooking.confirmationStatus !== 'Confirmed' && (
                  <p>Awaiting artist confirmation</p>
                )}
              {selectedBooking.status === 'Pending' && (
                <button onClick={onCancelBooking}>Cancel Booking</button>
              )}
              <button onClick={() => setSelectedBooking(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
