import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faEllipsisV,
  faBan,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import EventModal from "./EventModal";
import CancelReasonPopup from "./CancelReasonPopup"; // Import the separated component
import "./EventCard.css";

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close the modal
  const handleCloseModal = () => setShowModal(false);

  // Toggle the actions dropdown menu
  const handleToggleActionsMenu = (e) => {
    e.stopPropagation();
    setShowActionsMenu((prev) => !prev);
  };

  // Handle cancel event logic
  const handleCancel = () => {
    setShowActionsMenu(false);
    setShowCancelPopup(true); // Open the cancel reason popup
  };

  // Handle chat initiation
  const handleChat = () => {
    alert("Chat Started");
    setShowActionsMenu(false);
  };

  // Handle click outside to close dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowActionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    eventType = "Untitled Event",
    artistName = "No Artist",
    date = "No Date",
    time = "No Time",
    venue = "No Venue",
    eventCompleted = "Unknown",
  } = event;

  return (
    <div
      className="event-card"
      onClick={(e) => {
        e.stopPropagation();
        setShowModal(true);
      }}
    >
      {/* Event Status */}
      <div
        className={`booking-status ${
          event.eventCompleted ? "completed" : "not-completed"
        }`}
      >
        {event.eventCompleted ? "Completed" : "Not Completed"}
      </div>
      {/* Three-dot menu */}
      <div
        ref={menuRef}
        className="menu-icon"
        onClick={handleToggleActionsMenu}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
      {/* Divider */}
      <div className="divider"></div>
      {/* Event Title */}
      <div className="event-header">
        <h3>{eventType}</h3>
      </div>
      {/* Artist Info */}
      <div className="artist-info">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
        <span>{artistName}</span>
      </div>
      {/* Event Details */}
      <div className="event-details">
        <div className="event-info">
          <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
          <span>{date}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faClock} className="event-icon" />
          <span>{time}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
          <span>{venue}</span>
        </div>
        {/* Payment Status */}
        Payment:
        <span className="payment-status">{`${
          event.bookingStatus ? "Done" : "Not Done"
        }`}</span>
      </div>
      {/* Dropdown Menu */}
      {showActionsMenu && (
        <div ref={dropdownRef} className="drop-down-content">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleChat();
            }}
          >
            <FontAwesomeIcon icon={faComments} className="dropdown-icon" /> Chat
          </button>
        </div>
      )}
      {/* Cancel Reason Popup */}
      {showCancelPopup && (
        <CancelReasonPopup
          cancellationReason={cancelReason}
          setCancellationReason={setCancelReason}
          onConfirmCancel={handleCancel}
          onClose={() => setShowCancelPopup(false)}
        />
      )}
      {/* Modal */}
      {showModal && <EventModal event={event} onClose={handleCloseModal} />}
    </div>
  );
};

export default EventCard;
