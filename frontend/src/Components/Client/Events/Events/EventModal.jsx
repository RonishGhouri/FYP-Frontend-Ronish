import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faUser,
  faTimes,
  faInfoCircle,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import EventProgress from "./EventProgress"; // Import EventProgress
import "./EventModal.css";

const EventModal = ({ event, onClose, onMakePayment }) => {
  // Determine the current stage based on the event's booking and payment status
  const getCurrentStage = (event) => {
    if (
      event.bookingStatus === "Confirmed" &&
      event.paymentStatus === "Pending"
    ) {
      return 2; // Payment Pending stage
    } else if (event.bookingStatus === "Confirmed") {
      return 3; // In Transit stage
    } else if (event.paymentStatus === "Completed") {
      return 4; // Event Started stage
    }
    return 1; // Default stage (Artist Dispatched)
  };

  const currentStage = getCurrentStage(event);

  // State to store last updated time
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleString(); // Get current date and time
    setLastUpdated(date); // Set last updated time
  }, [event]); // Update lastUpdated when event changes

  return (
    <div className="modal-overlay">
      <div className="model-content">
        {/* Close Button (X) positioned at top-right of the modal */}
        <button
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onClose(); // Call parent function to close modal
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="event-modal-body">
          {/* Left Section (Event Details, Artist, and Payment Info) */}
          <div className="event-details-left">
            <h3>{event.eventType || "Unknown Event Type"}</h3>

            {/* Artist Info */}
            <div className="artist-info event-info">
              <FontAwesomeIcon icon={faUser} className="event-icon" />
              <span>{event.artistName || "No artist assigned"}</span>
            </div>

            {/* Artist Confirmation Status */}
            <div className="artist-confirmation event-info">
              {event.bookingStatus === "Completed" ? (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="event-icon confirmed"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="event-icon pending"
                />
              )}
              <span className="confirm">{`Artist Confirmation: ${
                event.bookingStatus ? "Done" : "Not Done"
              }`}</span>
            </div>

            {/* Event Info */}
            <div className="event-info">
              <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
              <span>Date: {event.date || "Date not available"}</span>
            </div>
            <div className="event-info">
              <FontAwesomeIcon icon={faClock} className="event-icon" />
              <span>Time: {event.time || "Time not available"}</span>
            </div>
            <div className="event-info">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
              <span>Venue: {event.venue || "Venue not available"}</span>
            </div>
            <div className="event-info">
              <FontAwesomeIcon icon={faInfoCircle} className="event-icon" />
              <span>
                Description: {event.description || "No description provided"}
              </span>
            </div>

            {/* Payment Status */}
            <div className="event-info">
              Payment:
              <span className="payment-status">{` ${
                event.bookingStatus ? "Done" : "Not Done"
              }`}</span>
            </div>
            <span>Payment will send after event completion</span>

            {/* Conditionally render the Make Payment button */}
            {event.bookingStatus === "Confirmed" &&
              event.paymentStatus === "Pending" && (
                <button className="make-payment-btn" onClick={onMakePayment}>
                  Make Payment
                </button>
              )}
          </div>

          {/* Right Section: Event Progress */}
          <div className="event-progress-right">
            <EventProgress
              eventId={event.id} // Pass the eventId to EventProgress
              currentStage={currentStage}
              lastUpdated={lastUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
