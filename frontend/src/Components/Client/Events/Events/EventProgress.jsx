import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faPlayCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import FeedbackPopup from "./FeedbackPopup";
import "./EventProgress.css";

const EventProgress = ({ eventId }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState("");
  const [eventData, setEventData] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // Track feedback popup visibility
  const [feedback, setFeedback] = useState(""); // Store feedback from the client

  const stages = [
    { id: "artistDispatched", label: "Heading to Venue", icon: faUser },
    { id: "clientArrived", label: "Arrived at Venue", icon: faMapMarkerAlt },
    { id: "clientStarted", label: "Event Started", icon: faPlayCircle },
    { id: "clientCompleted", label: "Event Completed", icon: faCheckCircle },
  ];

  // Fetch event data from Firestore
  useEffect(() => {
    if (!eventId) {
      console.error("No eventId provided.");
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "events", eventId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setEventData(data);
          setCurrentStage(calculateCurrentStage(data));
          setLastUpdated(new Date().toLocaleString());
        } else {
          console.error(`Event with ID ${eventId} does not exist.`);
        }
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  // Calculate current stage
  const calculateCurrentStage = (data) => {
    if (data.clientCompleted) return 4;
    if (data.clientStarted) return 3;
    if (data.clientArrived) return 2;
    if (data.artistDispatched) return 1;
    return -1;
  };

  // Send notification to the artist
  const sendNotificationToArtist = async (message) => {
    if (!eventData?.artistId) {
      console.error("Artist ID not found in event data.");
      return;
    }

    try {
      const notificationRef = collection(db, "notifications");
      await addDoc(notificationRef, {
        recipientId: eventData.artistId,
        message,
        eventId,
        timestamp: new Date().toISOString(),
        isRead: false,
      });
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Handle button clicks
  const handleStageClick = async (stage) => {
    if (!eventData) {
      console.error("Event data not loaded.");
      return;
    }

    const eventRef = doc(db, "events", eventId);
    const updateFields = {};
    let notificationMessage = "";

    try {
      if (
        stage === "clientArrived" &&
        eventData.artistDispatched &&
        eventData.artistArrived &&
        !eventData.clientArrived
      ) {
        updateFields.clientArrived = true;
        notificationMessage = "The client has arrived at the venue.";
      } else if (
        stage === "clientStarted" &&
        eventData.artistDispatched &&
        eventData.artistStarted &&
        !eventData.clientStarted
      ) {
        updateFields.clientStarted = true;
        notificationMessage = "The event has started.";
      } else if (
        stage === "clientCompleted" &&
        eventData.artistCompleted &&
        !eventData.clientCompleted
      ) {
        updateFields.clientCompleted = true;
        notificationMessage = "The event has been completed.";
        // Show the feedback popup
        setShowFeedbackPopup(true);
        
      }

      if (Object.keys(updateFields).length > 0) {
        await updateDoc(eventRef, updateFields);
        console.log("Stage updated successfully:", updateFields);

        // Send a notification after updating the stage
        if (notificationMessage) {
          sendNotificationToArtist(notificationMessage);
        }
      } else {
        console.log("No updates required.");
      }
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    try {
      if (!feedback.trim()) {
        console.error("Feedback is empty.");
        return;
      }

      const feedbackRef = collection(db, "feedback");
      await addDoc(feedbackRef, {
        eventId,
        feedback,
        submittedAt: new Date().toISOString(),
      });

      console.log("Feedback submitted successfully.");
      setShowFeedbackPopup(false); // Close the popup after submission
      setFeedback(""); // Clear the feedback input
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="event-progress-container">
      {stages.map((stage, index) => {
        const isCompleted = currentStage > index;
        const isActive = currentStage === index;

        return (
          <div key={stage.id} className="progress-step">
            <div
              className={`icon-container ${
                isCompleted ? "completed" : isActive ? "active" : ""
              }`}
              onClick={() => isActive && handleStageClick(stage.id)}
              style={{ cursor: isActive ? "pointer" : "not-allowed" }}
            >
              <FontAwesomeIcon icon={stage.icon} className="progress-icon" />
              {index < stages.length - 1 && (
                <div className={`line ${isCompleted ? "completed" : ""}`} />
              )}
            </div>
            <div
              className={`stage-label ${
                isCompleted ? "completed" : isActive ? "active" : ""
              }`}
            >
              {stage.label}
            </div>
          </div>
        );
      })}

      <div className="last-updated">
        <span>Last Updated: {lastUpdated || "Loading..."}</span>
      </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <FeedbackPopup
          artistId={eventData?.artistId} // Pass artistId from eventData
          bookingId={eventId}
          onClose={() => setShowFeedbackPopup(false)}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default EventProgress;
