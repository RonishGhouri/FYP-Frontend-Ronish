import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faUser,
  faEllipsisV,
  faBan,
  faComments,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import ArtistEventModal from "./ArtistEventModal";
import "./ArtistEventCard.css";

const ArtistEventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const db = getFirestore();

  // Toggle modal visibility
  const handleViewDetails = () => {
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide modal
  };

  // Toggle dropdown menu
  const handleToggleActionsMenu = (e) => {
    e.stopPropagation();
    setShowActionsMenu((prev) => !prev);
  };

  // Cancel event logic
  const handleCancel = () => {
    setShowActionsMenu(false);
    setShowCancelPopup(true);
  };

  const handleChat = () => {
    "";
  };

  const handleCancelConfirm = async () => {
    try {
      await updateDoc(doc(db, "events", event.id), {
        status: "Cancelled",
        cancelReason,
      });
      alert(`Event Cancelled. Reason: ${cancelReason}`);
    } catch (error) {
      console.error("Error cancelling event:", error);
      alert("Failed to cancel the event. Please try again.");
    }
    setShowCancelPopup(false);
    setCancelReason("");
  };

  const handleCancelClose = () => setShowCancelPopup(false);

  // Update progress stage in Firestore
  const updateStageInDatabase = async (stage) => {
    try {
      const updateFields = {};
      if (stage === 1) updateFields.artistDispatched = true;
      if (stage === 2) updateFields.inTransit = true;
      if (stage === 3) updateFields.artistArrived = true;
      if (stage === 4) updateFields.artistStarted = true;
      if (stage === 5) updateFields.eventCompleted = true;

      await updateDoc(doc(db, "events", event.id), updateFields);
      alert("Stage updated successfully.");
    } catch (error) {
      console.error("Error updating stage:", error);
      alert("Failed to update stage. Please try again.");
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="artist-event-card event-card" onClick={handleViewDetails}>
      {/* Actions menu icon */}
      <div
        ref={menuRef}
        className="menu-icon"
        onClick={handleToggleActionsMenu}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
      {/* Dropdown menu */}
      {showActionsMenu && (
        <div ref={dropdownRef} className="dropdown-content">
          <button onClick={handleCancel}>
            <FontAwesomeIcon icon={faBan} className="dropdown-icon" /> Cancel
          </button>
          <button onClick={handleChat}>
            <FontAwesomeIcon icon={faComments} className="dropdown-icon" /> Chat
          </button>
        </div>
      )}
      {/* Event Header */}
      <div className="event-header">
        <h3>{event.eventType || "Untitled Event"}</h3>
        <div
          className={`booking-status ${
            event.eventCompleted ? "completed" : "not-completed"
          }`}
        >
          {event.eventCompleted ? "Completed" : "Not Completed"}
        </div>
      </div>
      {/* Client Info */}
      <div className="client-info">
        <FontAwesomeIcon icon={faUser} className="event-icon" />
        <span>{event.clientName || "No client assigned"}</span>
      </div>
      {/* Event Details */}
      <div className="event-details">
        <div className="event-info">
          <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
          <span>{event.date || "No Date"}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faClock} className="event-icon" />
          <span>{event.time || "No Time"}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
          <span>{event.venue || "No Venue"}</span>
        </div>
      </div>
      {/* Payment Status */}
      Payment:
      <span className="payment-status">{`${
        event.bookingStatus ? "Done" : "Not Done"
      }`}</span>
      {/* Cancel Reason Popup */}
      {showCancelPopup &&
        ReactDOM.createPortal(
          <div className="cancel-popup">
            <div className="cancel-popup-content">
              <button className="close-icon" onClick={handleCancelClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h3>Cancel Event</h3>
              <textarea
                placeholder="Please provide a reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="cancel-popup-actions">
                <button onClick={handleCancelConfirm}>
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {/* Modal */}
      {showModal &&
        ReactDOM.createPortal(
          <div
            className="artist-event-modal-overlay"
            onClick={handleCloseModal} // Close on overlay click
          >
            <div
              className="artist-event-modal-content"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <ArtistEventModal
                event={event}
                onClose={handleCloseModal}
                onUpdateStage={updateStageInDatabase}
                isPresentEvent={event.status === "Present"} // Enable modal for present events
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ArtistEventCard;
