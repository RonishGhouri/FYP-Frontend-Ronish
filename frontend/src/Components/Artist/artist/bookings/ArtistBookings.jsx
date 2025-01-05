import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../firebaseConfig";
import "./ArtistBookings.css";
import ArtistSidebar from "../sidebar/ArtistSidebar";
import ArtistHeader from "../header/ArtistHeader";
import ArtistBookingModal from "./ArtistBookingModal";
import ClientProfilePage from "./ClientProfilePage"; // Import the modal component

const ArtistBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [clientProfile, setClientProfile] = useState(null); // State for client profile data
  const [showClientModal, setShowClientModal] = useState(false); // State for modal visibility
  const location = useLocation();

  // Monitor authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (location.state?.bookingId) {
      const { bookingId } = location.state;

      // Find and display the booking
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        setActiveTab(booking.status);
        setSelectedBooking(booking);
      }
    }
  }, [location.state, bookings]);
  // Fetch bookings from Firestore in real-time
  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("artistId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedBookings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBookings(fetchedBookings);
        });

        return () => unsubscribe();
      }
    };

    fetchBookings();
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBooking(null); // Reset modal if switching tabs
  };

  const fetchClientProfile = (clientId) => {
    try {
      const clientDoc = doc(db, "users", clientId);

      const unsubscribe = onSnapshot(clientDoc, (clientSnapshot) => {
        if (clientSnapshot.exists()) {
          setClientProfile(clientSnapshot.data());
          setShowClientModal(true); // Show the modal
        } else {
          console.error("Client data not found.");
        }
      });

      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  return (
    <div className="artist-dashboard-container">
      <ArtistSidebar />

      <div className="artist-main-container">
        <ArtistHeader />

        <div className="artist-manage-container">
          <h2>Manage Bookings</h2>
          <div className="Manage-tabs">
            {["Pending", "Cancelled", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`Manage-tab ${
                  activeTab === tab ? "Manage-active-tab" : ""
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="Manage-list-container">
            <div className="Manage-list">
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
                      className="Manage-item"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      {/* Date on the left */}
                      <div className="Manage-date">
                        {booking.eventStartDate || "N/A"}
                      </div>

                      {/* Booking Details */}
                      <div className="Manage-details">
                        <h4 className="Manage-heading">{booking.eventType}</h4>
                        <p>
                          <strong>Client:</strong> {booking.clientName}
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
                      {/* View Client Profile Button */}
                      <div className="Manage-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchClientProfile(booking.clientId); // Fetch client data and show modal
                          }}
                        >
                          View Client Profile
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {selectedBooking && (
            <ArtistBookingModal
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
              onUpdate={(msg) => console.log(msg)}
            />
          )}

          {showClientModal && (
            <ClientProfilePage
              client={clientProfile}
              onClose={() => setShowClientModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistBookings;
