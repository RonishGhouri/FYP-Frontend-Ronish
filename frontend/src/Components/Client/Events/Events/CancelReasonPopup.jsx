import React from "react";
import "./CancelReasonPopup.css"; // Import the separated CSS file

const CancelReasonPopup = ({
  cancellationReason,
  setCancellationReason,
  onConfirmCancel,
  onClose,
}) => {
  return (
    <div className="reason-popup" onClick={onClose}>
      <div
        className="reason-popup-content"
        onClick={(e) => e.stopPropagation()} // Prevents closing the popup when clicking inside
      >
        <h4>Provide Reason for Cancellation</h4>
        <textarea
          className="cancellation-reason-input"
          placeholder="Enter reason for cancellation"
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
        />
        <button className="finalize-cancel-button" onClick={onConfirmCancel}>
          Confirm Cancellation
        </button>
        <button className="close-popup-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CancelReasonPopup;
