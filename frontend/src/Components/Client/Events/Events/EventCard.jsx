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
} from "@fortawesome/free-solid-svg-icons";
import EventModal from "./EventModal";
import "./EventCard.css";
import PaymentPopup from "../../Bookings/PaymentPopup";

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleCloseModal = () => setShowModal(false);

  const handleToggleActionsMenu = () => {
    setShowActionsMenu(!showActionsMenu);
  };

  const handleCancel = () => {
    setShowActionsMenu(false);
    setShowCancelPopup(true);
  };

  const handleCancelConfirm = () => {
    alert(`Event Cancelled. Reason: ${cancelReason}`);
    setShowCancelPopup(false);
  };

  const handleChat = () => {
    alert("Chat Started");
    setShowActionsMenu(false);
  };

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
  const handleMakePayment = () => {
    setShowPaymentPopup(true);
  };

  // Closes Payment Popup
  const handleClosePaymentPopup = () => {
    setShowPaymentPopup(false);
  };
  const handleConfirmPayment = () => {
    alert("Payment Confirmed!");
    setShowPaymentPopup(false); // Close the payment popup after confirmation
  };

  return (
    <div
      className="event-card"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowModal(true);
      }}
    >
      {/* Booking Status */}
      <div className={`booking-status ${event.bookingStatus.toLowerCase()}`}>
        {event.bookingStatus}
      </div>

      {/* Three-dot menu */}
      <div
        ref={menuRef}
        className="menu-icon"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleActionsMenu();
        }}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Event Title */}
      <div className="event-header">
        <h3>{event.title}</h3>
      </div>

      {/* Artist Info */}
      <div className="artist-info">
        <FontAwesomeIcon icon={faUser} className="event-icon" />
        <span>{event.bookedArtists.join(", ")}</span>
      </div>

      {/* Event Details */}
      <div className="event-details">
        <div className="event-info">
          <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
          <span>{event.date}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faClock} className="event-icon" />
          <span>{event.time}</span>
        </div>
        <div className="event-info">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="event-icon" />
          <span>{event.venue}</span>
        </div>
      </div>

      {/* Payment Status */}
      <div className="payment-status">
        <span>{`Payment: ${event.paymentStatus}`}</span>
      </div>

      {/* Dropdown Menu */}
      {showActionsMenu && (
        <div ref={dropdownRef} className="drop-down-content">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              handleCancel();
            }}
          >
            <FontAwesomeIcon icon={faBan} className="dropdown-icon" /> Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              handleChat();
            }}
          >
            <FontAwesomeIcon icon={faComments} className="dropdown-icon" /> Chat
          </button>
        </div>
      )}

      {/* Cancel Popup */}
      {showCancelPopup && (
        <div
          className="cancel-popup"
          onClick={(e) => e.stopPropagation()} // Prevent bubbling to parent
        >
          <div className="cancel-popup-content">
            <h3>Cancel Event</h3>
            <textarea
              placeholder="Please provide a reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening when clicking confirm
                handleCancelConfirm();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <EventModal
          event={event}
          onClose={handleCloseModal}
          onMakePayment={handleMakePayment}
        />
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

export default EventCard;
