import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTruck, faMapMarkerAlt, faPlayCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import './ArtistEventProgress.css'; // Change the CSS file to use artist-specific styles

const ArtistEventProgress = ({ currentStage, lastUpdated }) => {
  const stages = [
    { id: "artist-dispatched", label: "Artist Dispatched", icon: faUser },
    { id: "in-transit", label: "In Transit", icon: faTruck },
    { id: "arrived", label: "Arrived at Venue", icon: faMapMarkerAlt },
    { id: "event-started", label: "Event Started", icon: faPlayCircle },
    { id: "event-completed", label: "Event Completed", icon: faCheckCircle }
  ];

  return (
    <div className="artist-event-progress-container">
      {/* Progress steps */}
      {stages.map((stage, index) => (
        <div key={stage.id} className="artist-progress-step">
          <div className={`artist-icon-container ${currentStage >= index + 1 ? 'completed' : ''}`}>
            <FontAwesomeIcon icon={stage.icon} className="artist-progress-icon" />
            <div className={`artist-line ${currentStage >= index + 1 ? 'completed' : ''}`}></div>
          </div>
          <div className={`artist-stage-label ${currentStage >= index + 1 ? 'completed' : ''}`}>
            {stage.label}
          </div>
        </div>
      ))}

      {/* Horizontal Line */}
      <div className="artist-horizontal-line"></div>

      {/* Last Updated Section */}
      <div className="artist-last-updated">
        <span>Last Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};

export default ArtistEventProgress;
