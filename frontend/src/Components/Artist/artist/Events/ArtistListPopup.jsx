import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ArtistListPopup.css";

const ArtistListPopup = ({ content, onClose }) => {
  const { title, type, eventList, clientList } = content;

  return (
    <div className="artist-popup-overlay">
      <div className="artist-popup-container">
        {/* Close Icon */}
        <div className="artist-popup-header">
          <FontAwesomeIcon
            icon={faTimes}
            className="artist-close-icon"
            onClick={onClose}
          />
        </div>

        {/* Popup Title */}
        <h2>{title}</h2>

        {/* Conditionally Render Content */}
        {type === "clients" ? (
          // Render Client-Specific Design
          <div className="artist-clients-list">
            {clientList.length > 0 ? (
              clientList.map((client, index) => (
                <div key={index} className="artist-client-item">
                  <img
                    src="path/to/default/profile/pic.png" // Replace with actual image URL
                    alt={client.name}
                    className="artist-client-image"
                  />
                  <div className="artist-client-info">
                    <h3>{client.name}</h3>
                    <p>Booked for: {client.eventTitle}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No clients booked.</p>
            )}
          </div>
        ) : (
          // Default Event List Design for Other Stats
          <div className="artist-events-list">
            {eventList.length > 0 ? (
              eventList.map((event) => (
                <div key={event.id} className="artist-event-item">
                  <div className="artist-event-detail">
                    <h3>{event.title}</h3>
                    <p>{event.date}</p>
                  </div>
                  <div className="artist-event-status">
                    <span>{event.type}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No events available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistListPopup;
