import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./BookingModal.css";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const isPM = +hour >= 12;
  const formattedHour = +hour % 12 || 12;
  return `${formattedHour}:${minute} ${isPM ? "PM" : "AM"}`;
};

let isBookingResubmitted = false; // Global flag for resubmission

const BookingModal = ({ booking, onClose, onEdit, onMakePayment, artist }) => {
  const [cancellationReason, setCancellationReason] = useState("");
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const auth = getAuth(); // Firebase Authentication
  const clientId = auth.currentUser?.uid; // Authenticated client's UID
  const navigate = useNavigate();

  const sendNotification = async (recipientId, message, type) => {
    try {
      await addDoc(collection(db, "notifications"), {
        bookingId: booking.id,
        recipientId,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const handleChatNowClick = async () => {
    const clientId = auth.currentUser?.uid;
    const chatId = `${clientId}_${artist.id}`;
    const chatDoc = doc(db, "chats", chatId);

    try {
      // Fetch client details from Firestore
      const clientRef = doc(db, "users", clientId);
      const clientSnapshot = await getDoc(clientRef);

      const clientData = clientSnapshot.exists()
        ? clientSnapshot.data()
        : {
            name: auth.currentUser?.displayName || "Client", // Fallback to Firebase Auth's displayName or "Client"
            profilePicture: "default-client-avatar.png", // Fallback to default avatar
          };

      // Fetch artist details from Firestore
      const artistRef = doc(db, "users", artist.id);
      const artistSnapshot = await getDoc(artistRef);

      const artistData = artistSnapshot.exists()
        ? artistSnapshot.data()
        : {
            name: artist.name || "Artist", // Use artist name or fallback
            avatar: "default-artist-avatar.png", // Default avatar
          };

      const chatSnapshot = await getDoc(chatDoc);

      if (!chatSnapshot.exists()) {
        const newChatData = {
          id: chatId,
          client: {
            id: clientId,
            name: clientData.name || "Unknown Client", // Ensure valid name
            avatar: clientData.profilePicture || "default-client-avatar.png", // Ensure valid avatar
          },
          artist: {
            id: artist.id,
            name: artistData.name || "Unknown Artist", // Ensure valid name
            avatar: artistData.profilePicture || "default-artist-avatar.png", // Ensure valid avatar
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

      navigate("/client/chats", {
        state: {
          artist: {
            id: artist.id,
            name: artistData.name,
            avatar: artistData.profilePicture,
          },
        },
      });
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: "Cancelled",
        cancellationReason,
        cancelledBy: "Client",
        resubmitAllowed: true,
      });

      toast.success("Booking has been cancelled");
      setShowReasonPopup(false);
      onClose();

      sendNotification(
        booking.artistId,
        `A booking for ${booking.eventType} has been cancelled by ${booking.clientName}`,
        "info"
      );
      if (!isBookingResubmitted) {
        let timeElapsed = 0;
        sendNotification(
          booking.clientId,
          `You have 3 minutes left to resubmit your booking for ${booking.eventType}.`,
          "info"
        );

        const intervalId = setInterval(() => {
          if (!isBookingResubmitted) {
            timeElapsed += 1;
            if (timeElapsed < 3) {
              sendNotification(
                booking.clientId,
                `You have ${
                  3 - timeElapsed
                } minutes left to resubmit your booking for ${
                  booking.eventType
                }.`,
                "info"
              );
            } else {
              clearInterval(intervalId);
            }
          } else {
            clearInterval(intervalId);
          }
        }, 60 * 1000);

        setTimeout(async () => {
          if (!isBookingResubmitted) {
            clearInterval(intervalId);
            await updateDoc(bookingRef, {
              eventDates: null,
              resubmitAllowed: false,
            });
            sendNotification(
              booking.clientId,
              `Now, you can't resubmit your booking for ${booking.eventType}.`,
              "info"
            );
          }
        }, 3 * 60 * 1000);
      }
    } catch (error) {
      toast.error("Failed to cancel the booking. Please try again.");
    }
  };

  const handleResubmitBooking = async () => {
    try {
      const bookingRef = doc(db, "bookings", booking.id);

      await updateDoc(bookingRef, {
        status: "Pending",
        cancellationReason: null,
        cancelledBy: null,
      });

      sendNotification(
        booking.artistId,
        `Booking for ${booking.eventType} has been resubmitted by ${booking.clientName}.`,
        "info"
      );

      isBookingResubmitted = true;
      toast.success("Booking has been resubmitted");
      onClose();
    } catch (error) {
      toast.error("Failed to resubmit the booking. Please try again.");
    }
  };

  const downloadSummary = () => {
    const doc = new jsPDF();
    let summary = `Booking Summary:\n\nType of Event: ${
      booking.eventType || "N/A"
    }\nClient: ${booking.clientName || "N/A"}\nArtist: ${
      booking.artistName
    }\nEvent Details: ${
      booking.eventDetails || "Untitled Event"
    }\nEvent Start Date: ${booking.eventStartDate || "N/A"}\nEvent End Date: ${
      booking.eventEndDate || "N/A"
    }\nEvent Starting Time: ${
      formatTimeTo12Hour(booking.eventTime) || "N/A"
    }\nEvent Duration (in days): ${booking.eventDaysCount || "N/A"}\nVenue: ${
      booking.location || "N/A"
    }\nTotal Cost: Rs. ${booking.grandTotal || 0}`;

    if (booking.status === "Cancelled") {
      summary += `\nCancellation Details:\n\nCancelled By: ${
        booking.cancelledBy || "N/A"
      }\nReason: ${booking.cancellationReason || "No reason provided"}`;
    }

    if (booking.status === "Completed" && booking.paid) {
      summary += `\nBooking Status: ${booking.status}\nPayment Status: Paid`;
    }

    const lineHeight = 10;
    const marginLeft = 10;
    let currentHeight = 10;

    summary.split("\n").forEach((line) => {
      doc.text(line, marginLeft, currentHeight);
      currentHeight += lineHeight;
    });

    doc.save("booking_summary.pdf");
  };

  const handleFeedbackSubmit = async (feedbackType) => {
    try {
      const ratingRef = doc(db, "ratings", booking.artistId); // Assuming artistId is the document ID
      const bookingRef = doc(db, "bookings", booking.id); // Reference to the current booking document
      const ratingSnapshot = await getDoc(ratingRef);

      let bad = 0;
      let average = 0;
      let excellent = 0;
      let totalReviews = 0;
      let createdAt = new Date().toISOString(); // Default to the current timestamp

      // Check if the document exists and fetch the existing data
      if (ratingSnapshot.exists()) {
        const ratingData = ratingSnapshot.data();
        bad = ratingData.bad || 0;
        average = ratingData.average || 0;
        excellent = ratingData.excellent || 0;
        totalReviews = ratingData.totalReviews || 0;
        createdAt = ratingData.createdAt || createdAt; // Use existing value or fallback
      }

      // Increment the relevant feedback type
      if (feedbackType === "Bad") bad += 1;
      if (feedbackType === "Average") average += 1;
      if (feedbackType === "Excellent") excellent += 1;

      // Update totalReviews
      totalReviews = bad + average + excellent;

      // Calculate overallRating
      const overallRating =
        (bad * 1 + average * 3 + excellent * 5) / totalReviews;

      // Update or set the Firestore document
      await setDoc(ratingRef, {
        bad,
        average,
        excellent,
        totalReviews,
        overallRating,
        createdAt, // Ensure createdAt is always defined
      });

      await updateDoc(bookingRef, {
        feedbackGiven: true, // Mark feedback as given
      });

      toast.success("Feedback submitted successfully");
      setShowFeedbackPopup(false); // Close the feedback popup
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const isDateNotPassed = new Date(booking.eventEndDate) > new Date();

  return (
    <div
      className="manage-modal"
      onClick={() => {
        if (showReasonPopup) {
          setShowReasonPopup(false);
        } else if (showFeedbackPopup) {
          setShowFeedbackPopup(false);
        } else {
          onClose();
        }
      }}
    >
      <div
        className="manage-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal content
      >
        <h3>{booking.eventType}</h3>
        <p>
          <strong>Artist:</strong> {booking.artistName}
        </p>
        <hr />
        <p>
          <strong>Event Details:</strong> {booking.eventDetails}
        </p>
        <p>
          <strong>Event Start Date:</strong> {booking.eventStartDate}
        </p>
        <p>
          <strong>Event Starting Time:</strong>{" "}
          {formatTimeTo12Hour(booking.eventTime)}
        </p>
        <p>
          <strong>Venue:</strong> {booking.location}
        </p>
        <hr />

        {booking.approved && (
          <p>
            <strong>Booking Status:</strong> Approved
          </p>
        )}

        {booking.paid && booking.status === "Completed" && (
          <p>
            <strong>Payment Status:</strong> Paid
          </p>
        )}

        {booking.status === "Cancelled" && (
          <div className="cancellation-details">
            <p>
              <strong>Cancelled By:</strong>{" "}
              {booking.cancelledBy === "Client" ? "Me" : "Artist"}
            </p>
            <p>
              <strong>Reason:</strong> {booking.cancellationReason}
            </p>
          </div>
        )}

        <div className="modal-actions">
          {booking.approved && booking.status === "Pending" && (
            <>
              <p>
                <strong>Artist will charge:</strong> {booking.artistCharges}
              </p>
              <button className="payment-button" onClick={onMakePayment}>
                Make Payment
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowReasonPopup(true)}
              >
                Cancel Booking
              </button>
            </>
          )}
          {booking.approved && (
            <>
              <button className="chat-button" onClick={handleChatNowClick}>
                Chat with Artist
              </button>
            </>
          )}

          {!booking.approved && booking.status === "Pending" && (
            <>
              <button className="edit-button" onClick={() => onEdit(booking)}>
                Edit Booking
              </button>
              <button className="chat-button" onClick={handleChatNowClick}>
                Chat with Artist
              </button>
            </>
          )}

          {booking.status === "Cancelled" &&
            booking.cancelledBy === "Client" &&
            isDateNotPassed &&
            booking.resubmitAllowed && (
              <button
                className="resubmit-button"
                onClick={handleResubmitBooking}
              >
                Resubmit Booking
              </button>
            )}

          {booking.status === "Cancelled" &&
            booking.cancelledBy === "Artist" && (
              <button
                className="feedback-button"
                onClick={() => setShowFeedbackPopup(true)}
                disabled={booking.feedbackGiven}
              >
                {booking.feedbackGiven
                  ? "Feedback Provided Already"
                  : "Provide Feedback"}
              </button>
            )}

          {booking.status !== "Pending" && (
            <button
              className="download-summary-button"
              onClick={downloadSummary}
            >
              Download Summary
            </button>
          )}
        </div>
      </div>

      {showReasonPopup && (
        <div className="reason-popup" onClick={() => setShowReasonPopup(false)}>
          <div
            className="reason-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Provide Reason for Cancellation</h4>
            <textarea
              className="cancellation-reason-input"
              placeholder="Enter reason for cancellation"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
            <button
              className="finalize-cancel-button"
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </button>
            <button
              className="close-popup-button"
              onClick={() => setShowReasonPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showFeedbackPopup && (
        <div
          className="feedback-popup"
          onClick={() => setShowFeedbackPopup(false)}
        >
          <div
            className="feedback-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Provide Feedback</h4>
            <div className="feedback-buttons">
              <button
                className="feedback-excellent"
                onClick={() => handleFeedbackSubmit("Excellent")}
              >
                Excellent 😊
              </button>
              <button
                className="feedback-average"
                onClick={() => handleFeedbackSubmit("Average")}
              >
                Average 😐
              </button>
              <button
                className="feedback-bad"
                onClick={() => handleFeedbackSubmit("Bad")}
              >
                Bad 😞
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModal;
