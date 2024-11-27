import React, { useState } from "react";
import "./BookingForm.css";

function BookingForm({ artist, clientInfo, onClose }) {
  const [name, setName] = useState(clientInfo?.name || "");
  const [email, setEmail] = useState(clientInfo?.email || "");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      artistName: artist.name,
      clientName: name,
      clientEmail: email,
      eventDetails,
      eventDate,
      eventTime,
      eventType,
      location,
    };

    console.log("Booking Data:", bookingData);
    alert(`Your booking request has been sent to ${artist.name} at ${location}.`);
    onClose();
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="booking-form-content">
          <h2>Booking Form</h2>
          <p>Artist: {artist.name}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Event Details</label>
              <textarea
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
                placeholder="e.g., Birthday Party with live band. Special note: Artist will perform for 2 hours."
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Select Time</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                <option value="">Select Event Type</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Party">Party</option>
                <option value="Birthday">Birthday</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 25-B, Gulberg III, Lahore"
                required
              />
            </div>
            <button type="submit" className="confirm-booking-btn">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
