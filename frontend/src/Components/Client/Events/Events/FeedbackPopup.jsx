// FeedbackPopup.js
import React from "react";
import "./FeedbackPopup.css"; // Create a separate CSS file if needed
import { toast } from "react-toastify";
import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const FeedbackPopup = ({ artistId, bookingId, onClose, onFeedbackSubmit }) => {
  const handleFeedbackSubmit = async (feedbackType) => {
    try {
      const ratingRef = doc(db, "ratings", artistId);
      const ratingSnapshot = await getDoc(ratingRef);

      let bad = 0;
      let average = 0;
      let excellent = 0;
      let totalReviews = 0;
      let createdAt = new Date().toISOString();

      // If the rating document exists, fetch existing data
      if (ratingSnapshot.exists()) {
        const data = ratingSnapshot.data();
        bad = data.bad || 0;
        average = data.average || 0;
        excellent = data.excellent || 0;
        totalReviews = data.totalReviews || 0;
        createdAt = data.createdAt || createdAt;
      }

      // Increment the appropriate feedback type
      if (feedbackType === "Bad") bad += 1;
      if (feedbackType === "Average") average += 1;
      if (feedbackType === "Excellent") excellent += 1;

      totalReviews = bad + average + excellent;

      // Calculate the overall rating
      const overallRating =
        ((bad * 1 + average * 3 + excellent * 5) / totalReviews).toFixed(1);

      // Update or create the rating document
      await setDoc(ratingRef, {
        bad,
        average,
        excellent,
        totalReviews,
        overallRating,
        createdAt,
      });

     
      toast.success("Feedback submitted successfully");
      onFeedbackSubmit(); // Trigger the parent handler
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(
        error.message || "Failed to submit feedback. Please try again."
      );
    }
  };

  return (
    <div className="feedback-popup" onClick={onClose}>
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
  );
};

export default FeedbackPopup;
