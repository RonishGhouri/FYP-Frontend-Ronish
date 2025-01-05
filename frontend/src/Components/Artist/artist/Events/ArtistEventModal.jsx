import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faUser,
  faTimes,
  faPhone,
  faInfoCircle, // Add new icon for event details
} from "@fortawesome/free-solid-svg-icons";
import ArtistEventProgress from "./ArtistEventProgress";
import "./ArtistEventModal.css";

const ArtistEventModal = ({ event, onClose, onMakePayment }) => {
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

  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleString(); // Get the current date and time
    setLastUpdated(date); // Set last updated time
  }, [event]); // Update when the event changes

  return ReactDOM.createPortal(
    <div className="artist-modal-overlay">
      <div className="artist-modal-main">
        {/* Close Button */}
        <button className="artist-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Modal Content */}
        <div className="artist-event-modal-body">
          {/* Left Section */}
          <div className="artist-event-details-left">
            <h3>{event.eventType}</h3>

            {/* Artist Info */}
            <div className="artist-client-info">
              {/* Client Name */}
              <div className="artist-name">
                <FontAwesomeIcon icon={faUser} className="event-icon" />
                <span>
                  {Array.isArray(event.bookedClients) &&
                  event.bookedClients.length > 0
                    ? event.bookedClients.map((client) => client.name).join(", ")
                    : "No clients yet"}
                </span>
              </div>

              {/* Client Phone Number */}
              {Array.isArray(event.bookedClients) &&
                event.bookedClients.length > 0 && (
                  <div className="artist-phone">
                    <FontAwesomeIcon icon={faPhone} className="event-icon" />
                    <span>
                      {event.bookedClients.map((client) => client.phone).join(", ")}
                    </span>
                  </div>
                )}
            </div>

            {/* Event Info */}
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
              <span>Date: {event.date}</span>
            </div>
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faClock} className="event-icon" />
              <span>Time: {event.time}</span>
            </div>
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
              <span>Address: {event.Address}</span>
            </div>

            {/* Event Details */}
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faInfoCircle} className="event-icon" />
              <span>Details: {event.eventDetails || "No details available"}</span>
            </div>

            {/* Payment Status */}
            <div className="artist-payment-status">
              <span>Payment: {event.paymentStatus}</span>
            </div>

            {/* Make Payment Button */}
            {event.bookingStatus === "Confirmed" &&
              event.paymentStatus === "Pending" && (
                <button
                  className="artist-make-payment-btn"
                  onClick={onMakePayment}
                >
                  Make Payment
                </button>
              )}
          </div>

          {/* Right Section */}
          <div className="artist-event-progress-right">
            <ArtistEventProgress
              currentStage={currentStage}
              lastUpdated={lastUpdated}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArtistEventModal;
