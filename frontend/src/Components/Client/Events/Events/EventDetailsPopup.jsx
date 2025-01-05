import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock, faMapMarkerAlt, faMusic, faCheckCircle, faExclamationCircle, faHourglassHalf, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import "./EventDetailsPopup.css"; 

const EventDetailsPopup = ({ event, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>{event.title}</h2>
          <button className="popup-close" onClick={onClose}>X</button>
        </div>

        <div className="popup-body">
          <div className="popup-left">
            <div className="event-detail">
              <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
              <p><strong>Date:</strong> {event.date}</p>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faClock} className="event-icon" />
              <p><strong>Time:</strong> {event.time}</p>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
              <p><strong>Venue:</strong> {event.venue}</p>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faMusic} className="event-icon" />
              <p><strong>Artists:</strong> {event.bookedArtists.join(", ")}</p>
            </div>
            <div className="event-detail">
              <p><strong>Description:</strong> {event.description}</p>
            </div>
            <button className="make-payment-btn">Make Payment</button>
          </div>

          <div className="popup-right">
            <div className="event-progress">
              <FontAwesomeIcon icon={faCheckCircle} className="progress-icon" />
              <p>Artist Dispatched</p>
            </div>
            <div className="event-progress">
              <FontAwesomeIcon icon={faHourglassHalf} className="progress-icon" />
              <p>In Transit</p>
            </div>
            <div className="event-progress">
              <FontAwesomeIcon icon={faExclamationCircle} className="progress-icon" />
              <p>Arrived at Venue</p>
            </div>
            <div className="event-progress">
              <FontAwesomeIcon icon={faPlayCircle} className="progress-icon" />
              <p>Event Started</p>
            </div>
            <div className="event-progress">
              <FontAwesomeIcon icon={faCheckCircle} className="progress-icon" />
              <p>Event Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPopup;
