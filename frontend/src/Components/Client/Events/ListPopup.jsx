import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Import close icon
import "./ListPopup.css";

const Popup = ({ events, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Close Icon */}
        <div className="popup-header">
          <FontAwesomeIcon
            icon={faTimes}
            className="close-icon"
            onClick={onClose}
          />
        </div>

        {/* Popup Body */}
        <div className="popup-body">
          <h2>Event List</h2>
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-detail">
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                </div>
                <div className="event-status">
                  <span>{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
