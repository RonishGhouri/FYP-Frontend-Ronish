import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock, faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import EventModal from "./EventModal";
import PaymentPopup from "../Bookings/PaymentPopup"; // Make sure to import PaymentPopup
import "./EventCard.css";

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false); // State to manage payment popup visibility

  // Opens modal
  const handleViewDetails = () => {
    setShowModal(true);
  };

  // Closes modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Opens Payment Popup
  const handleMakePayment = () => {
    setShowPaymentPopup(true);
  };

  // Closes Payment Popup
  const handleClosePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    alert('Payment Confirmed!');
    setShowPaymentPopup(false); // Close the payment popup after confirmation
  };

  return (
    <div className="event-card">
      <div className={`booking-status ${event.bookingStatus.toLowerCase()}`}>
        {event.bookingStatus}
      </div>

      <h3>{event.title}</h3>

      {/* Artist Name Section */}
      <div className="artist-info">
        <FontAwesomeIcon icon={faUser} className="event-icon" />
        <span>{event.bookedArtists.join(", ")}</span>
      </div>

      <div className="event-details">
        <div className="event-info">
          <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
          <span>{event.date}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faClock} className="event-icon" />
          <span>{event.time}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
          <span>{event.venue}</span>
        </div>
      </div>

      <div className="payment-status">
        <span>{`Payment: ${event.paymentStatus}`}</span>
      </div>

      {/* View Details Button */}
      <button className="view-details-btn" onClick={handleViewDetails}>
        View Details
      </button>

      {/* Modal */}
      {showModal && <EventModal event={event} onClose={handleCloseModal} onMakePayment={handleMakePayment} />}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          booking={event}
          onClose={handleClosePaymentPopup}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default EventCard;
