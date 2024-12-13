import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Notifications.css";

function Notifications() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      bookingUpdates: true,
    },
    smsNotifications: false,
    soundAlerts: false,
  });

  useEffect(() => {
    // Fetch notification settings from Firestore
    const fetchNotificationSettings = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedSettings = docSnap.data().notificationSettings || {};
          setNotificationSettings((prevSettings) => ({
            ...prevSettings,
            ...fetchedSettings,
            emailNotifications: {
              ...prevSettings.emailNotifications,
              ...(fetchedSettings.emailNotifications || {}),
            },
          }));
        } else {
          console.log("No notification settings found!");
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        setError("Failed to fetch notification settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, [currentUser]);

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    if (name.startsWith("emailNotifications")) {
      const notificationType = name.split(".")[1];
      setNotificationSettings((prevSettings) => ({
        ...prevSettings,
        emailNotifications: {
          ...prevSettings.emailNotifications,
          [notificationType]: checked,
        },
      }));
    } else {
      setNotificationSettings((prevSettings) => ({
        ...prevSettings,
        [name]: checked,
      }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { notificationSettings }, { merge: true });
      setSuccess(true);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setError("Failed to save notification settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Notifications</h2>
      {loading && <p>Loading...</p>}
      {success && (
        <p className="success-message">Notification settings updated successfully!</p>
      )}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Email Notifications (Booking Updates)</label>
          <input
            type="checkbox"
            name="emailNotifications.bookingUpdates"
            checked={notificationSettings.emailNotifications.bookingUpdates}
            onChange={handleNotificationChange}
          />
          Receive booking update emails
        </div>

        <div className="form-section">
          <label>SMS Notifications</label>
          <input
            type="checkbox"
            name="smsNotifications"
            checked={notificationSettings.smsNotifications}
            onChange={handleNotificationChange}
          />
          Enable SMS notifications
        </div>

        <div className="form-section">
          <label>Sound Alerts</label>
          <input
            type="checkbox"
            name="soundAlerts"
            checked={notificationSettings.soundAlerts}
            onChange={handleNotificationChange}
          />
          Enable sound alerts for notifications
        </div>

        <div className="form-section">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Notifications;
