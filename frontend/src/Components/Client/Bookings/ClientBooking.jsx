import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientBooking.css";
import ClientSidebar from "../sidebar/ClientSidebar";
import ClientHeader from "../header/ClientHeader";
import BookingModal from "./BookingModal";
import BookingForm from "../browse/BookingForm";
import PaymentPopup from "./PaymentPopup";
import { db, auth } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const ClientBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.bookingId) {
      const { bookingId } = location.state;

      // Find and set the booking
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        setActiveTab(booking.status); // Update active tab
        setSelectedBooking(booking); // Open the modal with booking details
      }
    }
  }, [location.state, bookings]);

  // Fetch the authenticated user
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    } else {
      console.error("No authenticated user found.");
    }
  }, []);

  // Handle notification-triggered booking opening
  const handleNotificationClick = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setActiveTab(booking.status); // Set the active tab based on booking status
      setSelectedBooking(booking); // Open the modal for the selected booking
    }
  };

  // Update based on location state (for navigation with bookingId)

  // Fetch bookings in real-time from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("clientId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        artist: {
          id: doc.data().artistId,
          name: doc.data().artistName,
          profilePicture:
            doc.data().artistProfilePicture || "default-avatar.png",
        },
      }));
      setBookings(fetchedBookings);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBooking(null);
  };

  const handleNotification = (message) => {
    setNotification({ show: true, message });
  };

  const closeNotificationModal = () => {
    setNotification({ show: false, message: "" });
  };

  const navigateToArtistProfile = (artistId) => {
    console.log("Navigating to artist profile with ID:", artistId);

    const userListener = onSnapshot(
      doc(db, "users", artistId),
      (userDoc) => {
        const userDetails = userDoc.exists() ? userDoc.data() : {};
        console.log("User details fetched:", userDetails);

        const portfolioListener = onSnapshot(
          doc(db, "portfolios", artistId),
          (portfolioDoc) => {
            const portfolioDetails = portfolioDoc.exists()
              ? portfolioDoc.data()
              : {};
            console.log("Portfolio details fetched:", portfolioDetails);

            const ratingListener = onSnapshot(
              doc(db, "ratings", artistId),
              (ratingDoc) => {
                const ratingDetails = ratingDoc.exists()
                  ? ratingDoc.data()
                  : {};
                console.log("Rating details fetched:", ratingDetails);

                const artistProfileData = {
                  id: artistId,
                  name: userDetails.name || "N/A",
                  profilePicture:
                    userDetails.profilePicture ||
                    "https://via.placeholder.com/150",
                  bio: userDetails.bio || "No bio available",
                  phone: userDetails.phone || null, // Display phone only if it exists
                  rating:
                    ratingDetails.overallRating !== undefined
                      ? ratingDetails.overallRating
                      : "N/A",
                  social: {
                    facebook: portfolioDetails.facebookLink || null,
                    instagram: portfolioDetails.instagramLink || null,
                    youtube: portfolioDetails.youtubeLink || null,
                  },
                };

                console.log(
                  "Artist data prepared for navigation:",
                  artistProfileData
                );

                // Navigate to profile page with artist data
                navigate("/profile", {
                  state: { artist: artistProfileData },
                });

                // Cleanup listeners after navigation
                userListener();
                portfolioListener();
                ratingListener();
              },
              (error) => {
                console.error("Error fetching rating data:", error);
              }
            );
          },
          (error) => {
            console.error("Error fetching portfolio data:", error);
          }
        );
      },
      (error) => {
        console.error("Error fetching user data:", error);
      }
    );
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
  };

  return (
    <div className="client-manage-dashboard">
      <ClientSidebar />
      <div className="client-main-content">
        <ClientHeader onNotificationClick={handleNotificationClick} />
        <div className="client-manage-container">
          <h2>Manage Bookings</h2>
          <div className="manage-tabs">
            {["Pending", "Cancelled", "Completed"].map((tab) => (
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
              {bookings.filter((b) => b.status === activeTab).length === 0 ? (
                <p className="empty-message">
                  No bookings available for this status.
                </p>
              ) : (
                bookings
                  .filter((b) => b.status === activeTab)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="manage-item"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="manage-date">
                        {booking.eventStartDate}
                      </div>
                      <div className="manage-details">
                        <h4 className="manage-heading">{booking.eventType}</h4>
                        <p>
                          <strong>Artist:</strong> {booking.artistName}
                        </p>
                        <p>
                          <strong>Venue:</strong> {booking.location}
                        </p>
                        <p>
                          <strong>Event Details:</strong> {booking.eventDetails}
                        </p>
                        <p>
                          <strong>Confirmation Status:</strong>{" "}
                          {booking.confirmationStatus || booking.status}
                        </p>
                      </div>
                      <div className="manage-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToArtistProfile(booking.artistId);
                          }}
                        >
                          View Artist Profile
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {selectedBooking && !isEditing && (
            <BookingModal
              booking={selectedBooking}
              artist={{
                id: selectedBooking.artistId,
                name: selectedBooking.artistName,
                profilePicture: selectedBooking.artistProfilePicture,
              }}
              onClose={() => setSelectedBooking(null)}
              onUpdate={(msg) => handleNotification(msg)}
              onEdit={handleEditBooking}
              onMakePayment={() => setShowPaymentPopup(true)}
            />
          )}

          {isEditing && selectedBooking && (
            <BookingForm
              artist={{
                id: selectedBooking.artistId,
                name: selectedBooking.artistName,
                chargesperevent: selectedBooking.artistCharges,
              }}
              bookingId={selectedBooking.id}
              initialData={{
                name: selectedBooking.clientName,
                email: selectedBooking.clientEmail,
                eventDetails: selectedBooking.eventDetails,
                eventDates: selectedBooking.eventDates,
                eventTime: selectedBooking.eventTime,
                eventType: selectedBooking.eventType,
                customEventType: selectedBooking.customEventType,
                location: selectedBooking.location,
              }}
              onClose={() => {
                setIsEditing(false);
                setSelectedBooking(null);
              }}
            />
          )}

          {showPaymentPopup && selectedBooking && (
            <PaymentPopup
              booking={selectedBooking}
              onClose={() => setShowPaymentPopup(false)}
              
            />
          )}

          {notification.show && (
            <div
              className="notification-modal-overlay"
              onClick={closeNotificationModal}
            >
              <div className="notification-modal">
                <p>{notification.message}</p>
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
