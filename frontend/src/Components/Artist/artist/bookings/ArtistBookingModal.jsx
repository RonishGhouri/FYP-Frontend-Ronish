import React, { useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./ArtistBookingModal.css";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";

// Utility function to format time to 12-hour format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const isPM = +hour >= 12;
  const formattedHour = +hour % 12 || 12;
  return `${formattedHour}:${minute} ${isPM ? "PM" : "AM"}`;
};

const ArtistBookingModal = ({ booking, onClose }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [artistChargesInput, setArtistChargesInput] = useState(""); // State for artist charges input
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChatWithClientClick = async () => {
    const artistId = auth.currentUser?.uid; // Get the current artist ID
    const chatId = `${booking.clientId}_${artistId}`;
    const chatDoc = doc(db, "chats", chatId);

    try {
      // Fetch artist details from the users collection
      const artistDocRef = doc(db, "users", artistId);
      const artistDocSnapshot = await getDoc(artistDocRef);

      if (!artistDocSnapshot.exists()) {
        console.error("Artist document not found in users collection");
        return;
      }

      const artistData = artistDocSnapshot.data();
      const artistName = artistData.name || "Artist"; // Fallback if name is not found
      const artistAvatar =
        artistData.profilePicture || "default-artist-avatar.png"; // Fallback for avatar

      // Check if the chat already exists
      const chatSnapshot = await getDoc(chatDoc);

      if (chatSnapshot.exists()) {
        const chatData = chatSnapshot.data();

        // If the chat was deleted by the artist, restore it
        if (chatData.deletedByArtist) {
          await updateDoc(chatDoc, {
            deletedByArtist: false,
          });
        }
      } else {
        // Create a new chat document
        const newChatData = {
          id: chatId,
          artist: {
            id: artistId,
            name: artistName,
            avatar: artistAvatar,
          },
          client: {
            id: booking.clientId,
            name: booking.clientName,
            avatar: booking.clientProfilePicture || "default-avatar.png",
          },
          clientMessages: [],
          artistMessages: [],
          createdAt: new Date().toISOString(),
          deletedByClient: false,
          deletedByArtist: false,
          clientOnline: true,
          artistOnline: true,
          artistTyping: false,
          clientTyping: false,
        };

        await setDoc(chatDoc, newChatData);
      }

      // Navigate to the artist chat screen
      navigate("/artist/chats", {
        state: {
          client: {
            id: booking.clientId,
            name: booking.clientName,
            avatar: booking.clientProfilePicture || "default-avatar.png",
          },
        },
      });
    } catch (error) {
      console.error("Error initializing chat with client:", error);
    }
  };

  const sendNotificationToClient = async (message, type) => {
    try {
      await addDoc(collection(db, "notifications"), {
        recipientId: booking.clientId, // Store the client's ID
        message,
        type,
        bookingId: booking.id,
        createdAt: new Date().toISOString(),
        isRead: false, // Default to unread
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const downloadSummary = () => {
    // Existing logic for downloading summary
  };

  const approveBooking = async () => {
    try {
      const bookingRef = doc(db, "bookings", booking.id);

      const updatedData = {
        approved: true,
      };

      // Update artistCharges only if the input is not empty
      if (artistChargesInput.trim() !== "") {
        updatedData.artistCharges = parseInt(artistChargesInput, 10);
      } else {
        updatedData.artistCharges = booking.artistCharges || 0;
      }

      await updateDoc(bookingRef, updatedData);
      toast.success("Booking has been approved!");

      await sendNotificationToClient(
        `Your booking for ${booking.eventType} has been approved by ${booking.artistName}.`,
        "approval"
      );
      onClose();
    } catch (error) {
      toast.error("Error approving booking. Please try again.");
      console.error("Error approving booking:", error);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: "Cancelled",
        cancellationReason: cancelReason,
        cancelledBy: "Artist",
        eventDates: [], // Set eventDates to null (or an empty array)
      });
      toast.success("Booking has been cancelled successfully.");
      await sendNotificationToClient(
        `Your booking for ${booking.eventType} has been cancelled by ${booking.artistName}.`,
        "cancellation"
      );
      setShowReasonPopup(false);
      onClose();
    } catch (error) {
      toast.error("Error cancelling booking. Please try again.");
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="manage-modal" onClick={onClose}>
      <div
        className="manage-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{booking.eventType}</h3>
        <p>
          <strong>Client:</strong> {booking.clientName}
        </p>
        <hr />
        <p>
          <strong>Event Details:</strong> {booking.eventDetails}
        </p>
        <p>
          <strong>Event Start Date:</strong> {booking.eventStartDate || "N/A"}
        </p>

        <p>
          <strong>Event Starting Time:</strong>{" "}
          {formatTimeTo12Hour(booking.eventTime)}
        </p>
        <p>
          <strong>Venue:</strong> {booking.location}
        </p>
        <hr />
        <p>
          <strong>Your Fees:</strong> Rs.{" "}
          {artistChargesInput.trim() !== ""
            ? artistChargesInput
            : booking.artistCharges || 0}
        </p>

        {booking.status === "Completed" && booking.paid && (
          <div className="cancellation-details">
            <p>
              <strong>Payment Status:</strong> Paid
            </p>
          </div>
        )}

        {booking.status === "Cancelled" && booking.cancelledBy === "Client" && (
          <div className="cancellation-details">
            <hr />
            <p>
              <strong>Cancelled By:</strong> Client
            </p>
            <p>
              <strong>Reason:</strong> {booking.cancellationReason}
            </p>
          </div>
        )}
        {booking.status === "Cancelled" && booking.cancelledBy === "Artist" && (
          <div className="cancellation-details">
            <hr />
            <p>
              <strong>Cancelled By:</strong> Me
            </p>
            <p>
              <strong>Reason:</strong> {booking.cancellationReason}
            </p>
          </div>
        )}
        <div className="modal-actions">
          {booking.status === "Pending" && !booking.approved && (
            <div>
              <label htmlFor="artistCharges"></label>
              <input
                type="number"
                id="artistCharges"
                value={artistChargesInput}
                onChange={(e) => setArtistChargesInput(e.target.value)}
                placeholder="Enter your charges you want"
                min="0"
              />
            </div>
          )}
        </div>
        <div className="modal-actions">
          {booking.status === "Pending" && (
            <>
              <button onClick={approveBooking} disabled={booking.approved}>
                {booking.approved ? "Booking Approved" : "Approve Booking"}
              </button>
              {!booking.approved && (
                <button onClick={() => setShowReasonPopup(true)}>
                  Cancel Booking
                </button>
              )}
            </>
          )}
          {["Cancelled", "Completed"].includes(booking.status) && (
            <button onClick={downloadSummary}>Download Summary</button>
          )}
          <button onClick={handleChatWithClientClick}>Chat with Client</button>
        </div>
      </div>

      {showReasonPopup && (
        <div className="reason-popup" onClick={(e) => e.stopPropagation()}>
          <div className="reason-popup-content">
            <h4>Provide Reason for Cancellation</h4>
            <textarea
              className="cancellation-reason-input"
              placeholder="Enter reason for cancellation"
              value={cancelReason}
              required
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <button
              className="Finalize-cancel-button"
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </button>
            <button
              className="Close-popup-button"
              onClick={() => setShowReasonPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistBookingModal;
