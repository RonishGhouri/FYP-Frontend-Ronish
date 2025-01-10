import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ArtistListPopup.css";

const ArtistListPopup = ({ content, onClose }) => {
  const { title, eventList = [], type } = content; // Default to empty array if undefined

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

        {/* Render Clients or Events */}
        {type === "clients" ? (
          <div className="artist-clients-list">
            {eventList.length > 0 ? (
              eventList.map((client, index) => (
                <div key={index} className="artist-client-item">
                  <img
                    src={
                      client.clientProfilePicture ||
                      "https://via.placeholder.com/50"
                    }
                    alt={client.clientName || "Client"}
                    className="artist-client-image"
                  />
                  <div className="artist-client-info">
                    <h3>{client.clientName || "Unknown Client"}</h3>
                    <p>Event Type: {client.eventType}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No clients available.</p>
            )}
          </div>
        ) : type === "events" && (title === "Upcoming Events" || title === "Total Events") ? (
          <div className="artist-events-list">
            {eventList.length > 0 ? (
              eventList.map((event, index) => (
                <div key={index} className="artist-event-item">
                  <div className="artist-event-detail">
                    <h3>{event.eventType || "Unknown Event"}</h3>
                    <p>{event.date || "No Date"}</p>
                  </div>
                  <div className="artist-event-status">
                    <span
                      className={`status-badge ${
                        event.status === "Upcoming" ? "status-upcoming" : ""
                      }`}
                    >
                      {event.status || "Unknown Status"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No events available.</p>
            )}
          </div>
        ) : type === "events" && title === "Total Earned" ? (
          <div className="artist-events-list">
            {eventList.length > 0 ? (
              eventList.map((event, index) => (
                <div key={index} className="artist-event-item">
                  <div className="artist-event-detail">
                    <h3>{event.eventType || "Unknown Event"}</h3>
                    <p>{event.date || "No Date"}</p>
                  </div>
                  <div className="artist-event-cost">
                    <span>₨. {event.earning || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No earnings data available.</p>
            )}
          </div>
        ) : (
          <div className="artist-events-list">
            {eventList.length > 0 ? (
              eventList.map((event, index) => (
                <div key={index} className="artist-event-item">
                  <div className="artist-event-detail">
                    <h3>{event.eventType || "Unknown Event"}</h3>
                    <p>{event.date || "No Date"}</p>
                  </div>
                  {event.cost && (
                    <div className="artist-event-cost">
                      <span>₨ {event.cost}</span>
                    </div>
                  )}
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
