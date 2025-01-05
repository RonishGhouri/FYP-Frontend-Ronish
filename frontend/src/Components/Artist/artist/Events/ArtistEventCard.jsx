import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom"; // Import ReactDOM for portals
import {
  faCalendarDay,
  faClock,
  faMapMarkerAlt,
  faUser,
  faPhone,
  faBan,
  faComments,
  faThumbsUp,
  faEllipsisV,
  faEye,
  faTimes, // FontAwesome icon for vertical dots
} from "@fortawesome/free-solid-svg-icons";
import ArtistEventModal from "./ArtistEventModal";
import PaymentPopup from "../../../Client/Bookings/PaymentPopup";
import "./ArtistEventCard.css";

const ArtistEventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Refs for menu button and dropdown
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Opens modal
  const handleViewDetails = () => {
    setShowModal(true);
    setShowActionsMenu(false); // Close the dropdown after selecting "View Details"
  };

  // Closes modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Opens Payment Popup
  const handleMakePayment = () => {
    setShowPaymentPopup(true);
  };

  // Closes Payment Popup
  const handleClosePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    alert("Payment Confirmed!");
    setShowPaymentPopup(false); // Close the payment popup after confirmation
  };

  // Toggle dropdown menu visibility
  const handleToggleActionsMenu = () => {
    setShowActionsMenu(!showActionsMenu);
  };

  // Action handlers
  const handleCancel = () => {
    setShowActionsMenu(false); // Close dropdown after action
    setShowCancelPopup(true); // Show the cancel reason popup
  };

  const handleCancelConfirm = () => {
    alert(`Event Cancelled. Reason: ${cancelReason}`);
    setShowCancelPopup(false); // Close the cancel reason popup
  };

  const handleCancelClose = () => {
    setShowCancelPopup(false); // Close the cancel reason popup without doing anything
  };

  const handleChat = () => {
    alert("Chat Started");
    setShowActionsMenu(false); // Close dropdown after action
  };

  const handleApprove = () => {
    alert("Event Approved");
    setShowActionsMenu(false); // Close dropdown after action
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) && // Clicked outside of menu button
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) // Clicked outside of dropdown
      ) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="artist-event-card" onClick={handleViewDetails}>
      {/* Three vertical dots for actions menu */}
      <div
        ref={menuRef}
        className="menu-icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when toggling menu
          handleToggleActionsMenu();
        }}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>

      {/* Horizontal line separator */}
      <div className="divider"></div>

      {/* Event Title and Booking Status (Aligned to the right) */}
      <div className="event-header">
        <h3>{event.eventType}</h3>
        <div
          className={`artist-booking-status ${event.bookingStatus.toLowerCase()}`}
        >
          {event.bookingStatus}
        </div>
      </div>

      {/* Artist Info and other sections */}
      <div className="artist-info">
        <FontAwesomeIcon icon={faUser} className="artist-event-icon" />
        <span>
          {Array.isArray(event.bookedClients) && event.bookedClients.length > 0
            ? event.bookedClients.map((client) => client.name).join(", ")
            : "No clients yet"}
        </span>
      </div>

      {/* Client Phone Number */}
      {Array.isArray(event.bookedClients) && event.bookedClients.length > 0 && (
        <div className="artist-client-phone">
          <FontAwesomeIcon icon={faPhone} className="artist-event-icon" />
          <span>
            {event.bookedClients.map((client) => client.phone).join(", ")}
          </span>
        </div>
      )}

      {/* Event Details */}
      <div className="artist-event-details">
        <div className="artist-event-info">
          <FontAwesomeIcon icon={faCalendarDay} className="artist-event-icon" />
          <span>{event.date}</span>
        </div>
        <div className="artist-event-info">
          <FontAwesomeIcon icon={faClock} className="artist-event-icon" />
          <span>{event.time}</span>
        </div>
        <div className="artist-event-info">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="artist-event-icon"
          />
          <span>{event.Address}</span>
        </div>
      </div>

      {/* Payment Status */}
      <div className="artist-payment-status">
        <span>{`Payment: ${event.paymentStatus}`}</span>
      </div>

      {/* Dropdown Actions */}
      {showActionsMenu && (
        <div ref={dropdownRef} className="dropdown-content">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal
              handleCancel();
            }}
          >
            <FontAwesomeIcon icon={faBan} className="dropdown-icon" /> Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal
              handleChat();
            }}
          >
            <FontAwesomeIcon icon={faComments} className="dropdown-icon" /> Chat
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal
              handleApprove();
            }}>
            <FontAwesomeIcon icon={faThumbsUp} className="dropdown-icon" />{" "}
            Approve
          </button>
        </div>
      )}

      {/* Cancel Reason Popup */}
      {showCancelPopup &&
        ReactDOM.createPortal(
          <div className="cancel-popup"
            onClick={(e) => e.stopPropagation()} // Prevent bubbling to parent
          >
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
          document.body // Render popup at the body level
        )}

      {/* Modal */}
      {showModal && (
        <div className="artist-event-modal-overlay" onClick={handleCloseModal}>
          <div
            className="artist-event-modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent modal clicks from bubbling to the card
          >
            <ArtistEventModal
              event={event}
              onClose={handleCloseModal} // Close button inside modal
              onMakePayment={handleMakePayment}
            />
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          booking={event}
          onClose={handleClosePaymentPopup}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default ArtistEventCard;
