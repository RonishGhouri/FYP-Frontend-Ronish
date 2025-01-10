import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ListPopup.css";

const Popup = ({ title, events, isArtistPopup, onClose }) => {
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
          <h2>{title}</h2>
          <div className="events-list">
            {isArtistPopup
              ? /* Artist-specific layout */
                events.map((event, index) => (
                  <div key={index} className="artist-profile">
                    {/* Profile Picture */}
                    <div className="profile-pic">
                      <img
                        src={
                          event.profilePicture ||
                          "https://via.placeholder.com/50"
                        } // Use profilePicture field
                        alt={`${event.artistName || "Artist"}'s profile`}
                      />
                    </div>
                    {/* Artist Details */}
                    <div className="artist-details">
                      <h3>{event.artistName || "Unknown Artist"}</h3>
                      <p>Booked for: {event.eventType || "No Type"}</p>
                    </div>
                  </div>
                ))
              : title === "Total Spent"
              ? /* Layout for Total Spent */
                events.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-detail">
                      <p>
                        <strong>{event.eventType || "N/A"}</strong>
                      </p>
                      <p>{event.date || "N/A"}</p>
                    </div>
                    <div className="event-cost">
                      <span>
                        <strong>Rs. </strong>
                        {event.cost || 0}
                      </span>
                    </div>
                  </div>
                ))
              : title === "Total Events"
              ? /* Layout for Total Events */
                events.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-detail">
                      <p>
                        <strong> {event.eventType || "N/A"}</strong>
                      </p>
                      <p>
                         {event.date || "N/A"}
                      </p>
                    </div>
                    <div className="event-status">
                      <span className={event.status || "unknown"}>
                        {event.status || "N/A"}
                      </span>
                    </div>
                  </div>
                ))
              : /* Default layout for other popups */
                events.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-detail">
                      <h3>{event.eventType || "Event"}</h3>
                      <p>{event.date || "N/A"}</p>
                    </div>
                    <div className="event-status">
                      <span className={event.statu || "unknown"}>
                        {event.status || "N/A"}
                      </span>
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
