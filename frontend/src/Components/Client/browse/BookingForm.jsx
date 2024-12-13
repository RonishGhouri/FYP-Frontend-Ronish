import React, { useState, useEffect } from "react";
import { useBookings } from "../../../Context/BookingsContext"; // Import the context
import "./BookingForm.css";

function BookingForm({ artist, clientInfo, onClose }) {
  const [name, setName] = useState(""); // Default to an empty string
  const [email, setEmail] = useState(""); // Default to an empty string
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState(""); // New state to hold selected event type
  const [customEventType, setCustomEventType] = useState(""); // New state for custom event type
  const [location, setLocation] = useState("");
  const [error, setError] = useState(""); // State for error message
  const { addBooking } = useBookings(); // Access the addBooking function

  // Get the current date in the format YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch profile information from localStorage if available
  useEffect(() => {
    const storedProfileData = JSON.parse(localStorage.getItem("clientProfileData")) || {};

    // Set name only if it's available
    if (storedProfileData.name) {
      setName(storedProfileData.name); // Auto-fill name if available
    }

    // Fetch location from profile
    if (storedProfileData.location) {
      setLocation(storedProfileData.location); // Auto-fill location if available
    }

    // Fetch email from personal details in localStorage
    const storedPersonalDetails = JSON.parse(localStorage.getItem("clientPersonalDetails")) || {};
    if (storedPersonalDetails.email) {
      setEmail(storedPersonalDetails.email); // Auto-fill email if available
    } else {
      setEmail(""); // If email is not found, make sure it's empty
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the event date is in the past
    if (eventDate < currentDate) {
      setError("Event date cannot be in the past. Please choose a valid date.");
      return;
    }

    // Reset error message if the date is valid
    setError("");

    const bookingData = {
      artistName: artist.name,
      clientName: name,
      clientEmail: email,
      eventDetails,
      eventDate,
      eventTime,
      eventType: eventType === "Other" ? customEventType : eventType, // Use custom event type if "Other" is selected
      location,
    };
    
    const newBooking = {
      id: Date.now(), // Generate a unique ID
      date: eventDate,
      time: eventTime,
      eventName: eventDetails, // Or use a default event name
      location,
      artist: { id: artist.id, name: artist.name, profileUrl: artist.profileUrl },
      eventType: eventType === "Other" ? customEventType : eventType,
      notes: eventDetails,
      status: "Pending",
    };

    console.log("Booking Data:", bookingData);
    addBooking(newBooking); // Add the booking to the global state
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
                value={name} // This will be blank if no name is available
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email} // This will be empty if email is not in localStorage
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
                min={currentDate} // Prevent past dates from being selected
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
                <option value="Other">Other</option> {/* Added 'Other' option */}
              </select>
            </div>
            {/* Conditionally render custom event type input field if 'Other' is selected */}
            {eventType === "Other" && (
              <div className="form-group">
                <label>Custom Event Type</label>
                <input
                  type="text"
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                  placeholder="Enter custom event type"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 25-B, Gulberg III, Lahore"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
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
