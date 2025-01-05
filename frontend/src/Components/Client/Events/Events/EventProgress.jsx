import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTruck, faMapMarkerAlt, faPlayCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import './EventProgress.css';

const EventProgress = ({ initialStage, lastUpdated }) => {
  // Use state to dynamically update the current stage
  const [currentStage, setCurrentStage] = useState(initialStage);

  const stages = [
    { id: "artist-dispatched", label: "Artist Dispatched", icon: faUser, clickable: false },
    { id: "in-transit", label: "In Transit", icon: faTruck, clickable: false },
    { id: "arrived", label: "Arrived at Venue", icon: faMapMarkerAlt, clickable: true },
    { id: "event-started", label: "Event Started", icon: faPlayCircle, clickable: true },
    { id: "event-completed", label: "Event Completed", icon: faCheckCircle, clickable: true }
  ];

  const handleClick = (stageIndex) => {
    // Update the stage only if it's clickable
    if (stages[stageIndex].clickable) {
      setCurrentStage(stageIndex + 1); // Update the stage
    }
  };

  return (
    <div className="event-progress-container">
      {/* Progress steps */}
      {stages.map((stage, index) => (
        <div 
          key={stage.id} 
          className="progress-step" 
          onClick={() => handleClick(index)}
          style={{ cursor: stage.clickable ? 'pointer' : 'default' }}>
          <div className={`icon-container ${currentStage >= index + 1 ? 'completed' : ''}`}>
            <FontAwesomeIcon icon={stage.icon} className="progress-icon" />
            <div className={`line ${currentStage >= index + 1 ? 'completed' : ''}`}></div>
          </div>
          <div className={`stage-label ${currentStage >= index + 1 ? 'completed' : ''}`}>
            {stage.label}
          </div>
        </div>
      ))}

      {/* Horizontal Line */}
      <div className="horizontal-line"></div>

      {/* Last Updated Section */}
      <div className="last-updated">
        <span>Last Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};

export default EventProgress;
