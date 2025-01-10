import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faUser,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ArtistEventProgress from "./ArtistEventProgress";
import "./ArtistEventModal.css";

const ArtistEventModal = ({ event, onClose, onUpdateStage, isPresentEvent }) => {
  // Ensure event and event.id exist
  if (!event || !event.id) {
    console.error("Invalid event object or missing eventId.");
    return null;
  }

  // Determine the current stage based on the event status
  const getCurrentStage = () => {
    switch (event.bookingStatus) {
      case "In Transit":
        return 2;
      case "Arrived at Venue":
        return 3;
      case "Event Started":
        return 4;
      case "Event Completed":
        return 5;
      default:
        return 1; // Default stage: Artist Dispatched
    }
  };

  const currentStage = getCurrentStage();
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleString();
    setLastUpdated(date);
  }, [event]);

  const handleStageClick = (stage) => {
    if (isPresentEvent && stage > currentStage) {
      alert(`Progressing to the next stage: ${stage}`);
      onUpdateStage(stage); // Update the stage
    }
  };

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
            <h3 className="event-type">{event.eventType || "Unknown Event"}</h3>

            {/* Client Information */}
            <div className="artist-client-info">
              <div className="artist-name">
                <FontAwesomeIcon icon={faUser} className="event-icon" />
                <span>{event.clientName || "Unknown Client"}</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
              <span>Date: {event.date || "No Date Provided"}</span>
            </div>
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faClock} className="event-icon" />
              <span>Time: {event.time || "No Time Provided"}</span>
            </div>
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
              <span>Venue: {event.venue || "No Address Provided"}</span>
            </div>
            <div className="artist-event-info">
              <FontAwesomeIcon icon={faInfoCircle} className="event-icon" />
              <span>Description: {event.eventDetails || "No details available"}</span>
            </div>

            {/* Payment Status */}
            <div className="artist-payment-status">
              <span>Payment: {event.bookingStatus ? "Done" : "Not Done"}</span>
              {event.bookingStatus && (
                <span>Payment will be received after event completion.</span>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="artist-event-progress-right">
            <ArtistEventProgress
              eventId={event.id} // Pass eventId to ArtistEventProgress
              currentStage={currentStage}
              lastUpdated={lastUpdated}
              onStageClick={handleStageClick}
              enableProgress={isPresentEvent} // Enable progress only for present events
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArtistEventModal;
