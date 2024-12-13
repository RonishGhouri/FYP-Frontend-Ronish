import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientBooking.css";
import ClientSidebar from "../sidebar/ClientSidebar";
import ClientHeader from "../header/ClientHeader";
import BookingModal from "./BookingModal";
import PaymentPopup from "./PaymentPopup";
import { useBookings } from "../../../Context/BookingsContext";

const ClientBooking = () => {
  const { bookings } = useBookings(); // Fetch bookings from the context
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBooking(null);
  };

  const handleCancelBooking = () => {
    const updatedBooking = { ...selectedBooking, status: "Cancelled" };
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === selectedBooking.id ? updatedBooking : booking
      )
    );
    setSelectedBooking(null);
    showNotificationMessage("Booking has been cancelled.");
  };

  const handleResubmitBooking = (updatedBooking) => {
    const resubmittedBooking = { ...updatedBooking, status: "Pending" };
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === updatedBooking.id ? resubmittedBooking : booking
      )
    );
    setSelectedBooking(null);
    showNotificationMessage("Booking has been resubmitted and is now Pending.");
  };

  const handlePayment = () => {
    setShowPaymentPopup(true);
  };

  const handleConfirmPayment = () => {
    const updatedBooking = {
      ...selectedBooking,
      status: "Upcoming",
      paymentRequired: false,
    };
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === selectedBooking.id ? updatedBooking : booking
      )
    );
    setSelectedBooking(null);
    setShowPaymentPopup(false);
    showNotificationMessage("Payment successful. Booking confirmed!");
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const closeNotificationModal = () => {
    setShowNotification(false);
    setNotificationMessage("");
  };

  const navigateToArtistProfile = (url) => {
    navigate(url);
  };

  return (
    <div className="client-manage-dashboard">
      <ClientSidebar />
      <div className="client-main-content">
        <ClientHeader />
        <div className="client-manage-container">
          <h2>Manage Bookings</h2>
          <div className="manage-tabs">
            {["Upcoming", "Pending", "Cancelled", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`manage-tab ${
                  activeTab === tab ? "manage-active-tab" : ""
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="manage-list-container">
            <div className="manage-list">
              {bookings.filter((booking) => booking.status === activeTab)
                .length === 0 ? (
                <p className="empty-message">
                  No bookings available for this status.
                </p>
              ) : (
                bookings
                  .filter((booking) => booking.status === activeTab)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="manage-item"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      {/* Date on the left */}
                      <div className="manage-date">{booking.date}</div>

                      {/* Booking Details */}
                      <div className="manage-details">
                        <h4 className="manage-heading">{booking.eventType}</h4>
                        <p>Artist: {booking.artist.name}</p>
                        <p>Location: {booking.location}</p>
                        <p>Event Details/Special Notes: {booking.eventName}</p>
                        <p>
                          Confirmation Status:{" "}
                          {booking.confirmationStatus
                            ? booking.confirmationStatus
                            : booking.status}
                        </p>
                      </div>

                      {/* View Artist Button */}
                      <div className="manage-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToArtistProfile(booking.artist.profileUrl);
                          }}
                        >
                          View Artist
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {selectedBooking && (
            <BookingModal
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
              onCancelBooking={handleCancelBooking}
              onPayment={handlePayment}
              onResubmitBooking={handleResubmitBooking}
            />
          )}

          {showPaymentPopup && selectedBooking && (
            <PaymentPopup
              booking={selectedBooking}
              onClose={() => setShowPaymentPopup(false)}
              onConfirm={handleConfirmPayment}
            />
          )}

          {/* Notification Modal */}
          {showNotification && (
            <div
              className="notification-modal-overlay"
              onClick={closeNotificationModal}
            >
              <div className="notification-modal">
                <p>{notificationMessage}</p>
                <button
                  onClick={closeNotificationModal}
                  className="notification-close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
