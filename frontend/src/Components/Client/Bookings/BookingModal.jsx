import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingModal.css';

const BookingModal = ({ booking, onClose, onCancelBooking, onPayment, onEditBooking, onChat, onResubmitBooking }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const navigateToArtistProfile = (url) => {
    navigate(url);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    onEditBooking(booking); // Trigger the edit functionality
  };

  const handleResubmitClick = () => {
    // Update the booking status to 'Pending'
    const updatedBooking = { ...booking, status: 'Pending' };
    onResubmitBooking(updatedBooking); // Trigger resubmit functionality
  };

  const isDateNotPassed = new Date(booking.date) > new Date(); // Check if booking date hasn't passed

  return (
    <div className="manage-modal" onClick={onClose}>
      <div className="manage-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{booking.eventType}</h3>
        <p>Date: {booking.date}</p>
        <p>Time: {booking.time}</p>
        <p>Location: {booking.location}</p>
        <p>Artist: {booking.artist.name}</p>
        <p>Event Details/Special Notes: {booking.notes}</p>
        
        <div className="modal-actions">
          {booking.status === 'Pending' && booking.confirmationStatus === 'Confirmed' && booking.paymentRequired && (
            <button className="payment-button" onClick={onPayment}>Make Payment</button>
          )}
          
          {booking.status === 'Pending' && booking.confirmationStatus !== 'Confirmed' && (
            <p>Awaiting artist confirmation</p>
          )}
          
          {booking.status === 'Pending' && (
            <>
              <button className="chat-button" onClick={onChat}>Chat with Artist</button>
              <button className="edit-button" onClick={handleEditClick}>Edit Booking</button>
            </>
          )}

          {booking.status === 'Cancelled' && isDateNotPassed && (
            <button className="resubmit-button" onClick={handleResubmitClick}>Resubmit Booking</button>
          )}

          {booking.status === 'Pending' && (
            <button className="cancel-button" onClick={onCancelBooking}>Cancel Booking</button>
          )}

          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
