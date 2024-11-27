import React from "react";
import { useState, useEffect } from "react";

import "./BookingPreferences.css";

const BookingPreferences = () => {
  const [bookingPreferences, setBookingPreferences] = useState({
    availability: "",
    bookingAlerts: false,
    bookingPolicies: "",
    pricing: "",
  });

  useEffect(() => {
    // Retrieve personal details from localStorage

    // Retrieve password data from localStorage

    // Retrieve notification settings from localStorage

    // Retrieve booking preferences from localStorage
    const storedBookingPreferences = localStorage.getItem("bookingPreferences");
    const parsedBookingPreferences = storedBookingPreferences
      ? JSON.parse(storedBookingPreferences)
      : {};

    setBookingPreferences((prevBookingPreferences) => ({
      ...prevBookingPreferences,
      ...parsedBookingPreferences,
    }));
  }, []);

  const handleBookingPreferencesChange = (e) => {
    const { name, value, checked, type } = e.target;
    setBookingPreferences({
      ...bookingPreferences,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Store booking preferences in localStorage
    localStorage.setItem(
      "bookingPreferences",
      JSON.stringify(bookingPreferences)
    );
  };
  return (
    <div className="profile-section">
      <h2>Booking Preferences</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Availability Calendar</label>
          <input
            type="date"
            name="availability"
            value={bookingPreferences.availability}
            onChange={handleBookingPreferencesChange}
            className="form-input"
            placeholder="Select available dates"
          />
        </div>

        <div className="form-section">
          <label>Booking Alerts</label>
          <input
            type="checkbox"
            name="bookingAlerts"
            checked={bookingPreferences.bookingAlerts}
            onChange={handleBookingPreferencesChange}
          />{" "}
          Enable Booking Alerts
        </div>

        <div className="form-section">
          <label>Booking Policies (Cancellation, Refunds)</label>
          <textarea
            name="bookingPolicies"
            value={bookingPreferences.bookingPolicies}
            onChange={handleBookingPreferencesChange}
            className="form-input"
            rows="4"
            placeholder="Enter your booking policies (cancellation, refund)"
          />
        </div>

        <div className="form-section">
          <label>Rates and Pricing</label>
          <input
            type="number"
            name="pricing"
            value={bookingPreferences.pricing}
            onChange={handleBookingPreferencesChange}
            className="form-input"
            placeholder="Enter hourly or package rates"
          />
        </div>

        {/* Save Button */}
        <div className="form-section">
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingPreferences;
