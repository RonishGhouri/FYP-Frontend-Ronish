import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faMusic,
  faCheckCircle,
  faExclamationCircle,
  faHourglassHalf,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./ArtistEventDetailsPopup.css"; // Import the updated CSS file for the artist view

const ArtistEventDetailsPopup = ({ event, onClose }) => {
  return (
    <div className="artist-popup-overlay">
      <div className="artist-popup">
        <div className="artist-popup-header">
          <h2>{event.title}</h2>
          <button className="artist-popup-close" onClick={onClose}>
            X
          </button>
        </div>

        <div className="artist-popup-body">
          <div className="artist-popup-left">
            <div className="artist-event-detail">
              <FontAwesomeIcon
                icon={faCalendarDay}
                className="artist-event-icon"
              />
              <p>
                <strong>Date:</strong> {event.date}
              </p>
            </div>
            <div className="artist-event-detail">
              <FontAwesomeIcon icon={faClock} className="artist-event-icon" />
              <p>
                <strong>Time:</strong> {event.time}
              </p>
            </div>
            <div className="artist-event-detail">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="artist-event-icon"
              />
              <p>
                <strong>Venue:</strong> {event.venue}
              </p>
            </div>
            <div className="artist-event-detail">
              <FontAwesomeIcon icon={faMusic} className="artist-event-icon" />
              <p>
                <strong>Artists:</strong> {event.bookedArtists.join(", ")}
              </p>
            </div>
            <div className="artist-event-detail">
              <p>
                <strong>Description:</strong> {event.description}
              </p>
            </div>
          </div>

          <div className="artist-popup-right">
            <div className="artist-event-progress">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="artist-progress-icon"
              />
              <p>Artist Dispatched</p>
            </div>
            <div className="artist-event-progress">
              <FontAwesomeIcon
                icon={faHourglassHalf}
                className="artist-progress-icon"
              />
              <p>In Transit</p>
            </div>
            <div className="artist-event-progress">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="artist-progress-icon"
              />
              <p>Arrived at Venue</p>
            </div>
            <div className="artist-event-progress">
              <FontAwesomeIcon
                icon={faPlayCircle}
                className="artist-progress-icon"
              />
              <p>Event Started</p>
            </div>
            <div className="artist-event-progress">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="artist-progress-icon"
              />
              <p>Event Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistEventDetailsPopup;
