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
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Firestore config
import "./ArtistEventProgress.css";

const ArtistEventProgress = ({
  eventId,
  enableProgress,
  clientId,
  artistName,
}) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState("");
  const [eventData, setEventData] = useState(null);

  const stages = [
    { id: "artistDispatched", label: "Heading to Venue", icon: faUser },
    { id: "artistArrived", label: "Arrived at Venue", icon: faMapMarkerAlt },
    { id: "artistStarted", label: "Event Started", icon: faPlayCircle },
    { id: "artistCompleted", label: "Event Completed", icon: faCheckCircle },
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
    if (data.artistCompleted) return 4;
    if (data.artistStarted) return 3;
    if (data.artistArrived) return 2;
    if (data.artistDispatched) return 1;
    return 0;
  };

  // Send Notification to Client
  const sendNotificationToClient = async (stageLabel) => {
    try {
      if (!clientId) {
        console.error("Client ID is required to send notifications.");
        return;
      }

      const notificationRef = collection(db, "notifications");
      await addDoc(notificationRef, {
        recipientId: clientId,
        message: `Artist has updated progress".`,
        type: "progressUpdate",
        eventId: eventId,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      console.log("Notification sent to client successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Handle button clicks
  const handleStageClick = async (stage, stageLabel) => {
    if (!eventData || !enableProgress) {
      console.error("Event data not loaded or progress is disabled.");
      return;
    }

    const eventRef = doc(db, "events", eventId);
    const updateFields = {};

    try {
      if (stage === "artistDispatched" && !eventData.artistDispatched) {
        updateFields.artistDispatched = true;
      } else if (
        stage === "artistArrived" &&
        eventData.artistDispatched &&
        !eventData.artistArrived
      ) {
        updateFields.artistArrived = true;
      } else if (
        stage === "artistStarted" &&
        eventData.clientArrived &&
        !eventData.artistStarted
      ) {
        updateFields.artistStarted = true;
      } else if (
        stage === "artistCompleted" &&
        eventData.clientStarted &&
        !eventData.artistCompleted
      ) {
        updateFields.artistCompleted = true;
      }

      if (Object.keys(updateFields).length > 0) {
        await updateDoc(eventRef, updateFields);
        console.log("Stage updated successfully:", updateFields);

        // Send notification to the client
        await sendNotificationToClient(stageLabel);
      } else {
        console.log("No updates required.");
      }
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };

  return (
    <div className="artist-event-progress-container">
      {stages.map((stage, index) => {
        const isCompleted = currentStage > index;
        const isActive = currentStage === index;

        return (
          <div key={stage.id} className="artist-progress-step">
            <div
              className={`artist-icon-container ${
                isCompleted ? "completed" : isActive ? "active" : ""
              }`}
              onClick={() =>
                enableProgress &&
                isActive &&
                handleStageClick(stage.id, stage.label)
              }
              style={{
                cursor: enableProgress && isActive ? "pointer" : "not-allowed",
              }}
            >
              <FontAwesomeIcon
                icon={stage.icon}
                className="artist-progress-icon"
              />
              {index < stages.length - 1 && (
                <div
                  className={`artist-line ${isCompleted ? "completed" : ""}`}
                />
              )}
            </div>
            <div
              className={`artist-stage-label ${
                isCompleted ? "completed" : isActive ? "active" : ""
              }`}
            >
              {stage.label}
            </div>
          </div>
        );
      })}

      <div className="artist-last-updated">
        <span>Last Updated: {lastUpdated || "Loading..."}</span>
      </div>
    </div>
  );
};

export default ArtistEventProgress;
