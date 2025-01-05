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
            {isArtistPopup ? (
              /* Artist-specific layout */
              events.map((event) =>
                event.bookedArtists.map((artist, index) => (
                  <div key={index} className="artist-profile">
                    {/* Profile Picture */}
                    <div className="profile-pic">
                      <img
                        src={`https://via.placeholder.com/50`} // Replace with artist image URL
                        alt={`${artist}'s profile`}
                      />
                    </div>
                    {/* Artist Details */}
                    <div className="artist-details">
                      <h3>{artist}</h3>
                      <p>Booked for: {event.title}</p>
                    </div>
                  </div>
                ))
              )
            ) : title === "Total Spent" ? (
              /* Layout for Total Spent */
              events.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-detail">
                    <h3>{event.title}</h3>
                    <p>{event.date}</p>
                  </div>
                  <div className="event-cost">
                    <span>Rs. {event.cost}</span>
                  </div>
                </div>
              ))
            ) : (
              /* Default layout for other popups */
              events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-detail">
                    <h3>{event.title}</h3>
                    <p>{event.date}</p>
                  </div>
                  <div className="event-status">
                    <span className={event.type}>{event.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
