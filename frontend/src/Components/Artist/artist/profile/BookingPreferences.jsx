import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./BookingPreferences.css";

const BookingPreferences = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [bookingPreferences, setBookingPreferences] = useState({
    availability: {
      from: "",
      till: "",
    },
    bookingAlerts: false,
    chargesperevent: "",
  });

  useEffect(() => {
    // Fetch booking preferences from Firestore
    const fetchBookingPreferences = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBookingPreferences({
            ...bookingPreferences,
            ...data,
            availability: {
              from: data?.availability?.from || "",
              till: data?.availability?.till || "",
            },
            chargesperevent: data?.chargesperevent || "", // Store as is (with or without "Rs")
          });
        } else {
          console.log("No booking preferences found!");
        }
      } catch (error) {
        console.error("Error fetching booking preferences:", error);
        setError("Failed to fetch booking preferences. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingPreferences();
  }, [currentUser]);

  const handleBookingPreferencesChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name.startsWith("availability.")) {
      const field = name.split(".")[1];
      setBookingPreferences((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          [field]: value,
        },
      }));
    } else {
      setBookingPreferences((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      // Ensure "Rs" is appended to the chargesperevent value
      const updatedPreferences = {
        ...bookingPreferences,
        chargesperevent: `${bookingPreferences.chargesperevent.replace(/Rs/g, "").trim()} Rs`,
      };

      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, updatedPreferences, { merge: true });
      setSuccess(true);
    } catch (error) {
      console.error("Error saving booking preferences:", error);
      setError("Failed to save booking preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Booking Preferences</h2>
      {loading && <p>Loading...</p>}
      {success && <p className="success-message">Booking preferences updated successfully!</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSaveChanges}>
        {/* Availability Calendar */}
        <div className="form-section">
          <label>Availability</label>
          <div className="availability-section">
            <label>From:</label>
            <input
              type="date"
              name="availability.from"
              value={bookingPreferences.availability.from}
              onChange={handleBookingPreferencesChange}
              className="form-input"
            />
            <label>Till:</label>
            <input
              type="date"
              name="availability.till"
              value={bookingPreferences.availability.till}
              onChange={handleBookingPreferencesChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Booking Alerts */}
        <div className="form-section">
          <label>Booking Alerts</label>
          <input
            type="checkbox"
            name="bookingAlerts"
            checked={bookingPreferences.bookingAlerts}
            onChange={handleBookingPreferencesChange}
          />
          Enable Booking Alerts
        </div>

        {/* Rate Per Event */}
        <div className="form-section">
          <label>Charges Per Event (Rs)</label>
          <input
            type="text"
            name="chargesperevent"
            value={bookingPreferences.chargesperevent.replace(/Rs/g, "").trim()}
            onChange={handleBookingPreferencesChange}
            className="form-input"
            placeholder="Enter charges per event"
          />
        </div>

        {/* Save Button */}
        <div className="form-section">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingPreferences;
