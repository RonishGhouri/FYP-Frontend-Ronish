import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock, faMapMarkerAlt, faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./EventModal.css";

const EventModal = ({ event, onClose, onMakePayment }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button (X) positioned at top-right of the modal */}
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="event-modal-body">
          {/* Event Details (Including Artist and Payment Status) */}
          <div className="event-details-left">
            <h3>{event.title}</h3>

            {/* Artist Info */}
            <div className="artist-info">
              <FontAwesomeIcon icon={faUser} className="event-icon" />
              <span>{event.bookedArtists.join(", ")}</span>
            </div>

            {/* Event Info */}
            <div className="event-info">
              <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
              <span>Date: {event.date}</span>
            </div>
            <div className="event-info">
              <FontAwesomeIcon icon={faClock} className="event-icon" />
              <span>Time: {event.time}</span>
            </div>
            <div className="event-info">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
              <span>Venue: {event.venue}</span>
            </div>

            {/* Payment Status */}
            <div className="payment-status">
              <span>{`Payment: ${event.paymentStatus}`}</span>
            </div>

            {/* Conditionally render the Make Payment button */}
            {event.bookingStatus === "Confirmed" && event.paymentStatus === "Pending" && (
              <button className="make-payment-btn" onClick={onMakePayment}>
                Make Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
