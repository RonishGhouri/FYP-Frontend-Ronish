import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Notifications.css";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

function Notifications() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [notificationSettings, setNotificationSettings] = useState({
    chatMessageNotifications: false,
    soundAlerts: false,
    bookingAlerts: false,
    paymentAlerts: false,
  });

  useEffect(() => {
    // Fetch notification settings from Firestore
    const fetchNotificationSettings = async () => {
      if (!currentUser) return;
      setLoading(true);
      setLoadings(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedSettings = docSnap.data().notificationSettings || {};
          setNotificationSettings((prevSettings) => ({
            ...prevSettings,
            ...fetchedSettings,
          }));
        } else {
          console.log("No notification settings found!");
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        setError("Failed to fetch notification settings. Please try again.");
      } finally {
        setLoading(false);
        setLoadings(false);
      }
    };

    fetchNotificationSettings();
  }, [currentUser]);

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoadings(true);
    setSuccess(false);
    setError("");

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { notificationSettings }, { merge: true });
      toast.success("Notification settings updated successfully!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to save notification settings. Please try again.");
    } finally {
      setLoadings(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Notifications</h2>
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loaderContainer}>
            <ThreeDot
              color="#212ea0" // Loader color
              size="small" // Loader size
            />
          </div>
        </div>
      )}
      <div className="form-section">
        <label>Chat Message Notifications</label>
        <input
          type="checkbox"
          name="chatMessageNotifications"
          checked={notificationSettings.chatMessageNotifications}
          onChange={handleNotificationChange}
        />
        Enable chat message notifications
      </div>

      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Booking Alerts</label>
          <input
            type="checkbox"
            name="bookingAlerts"
            checked={notificationSettings.bookingAlerts}
            onChange={handleNotificationChange}
          />
          Enable booking notifications
        </div>

        <div className="form-section">
          <label>Payment Alerts</label>
          <input
            type="checkbox"
            name="paymentAlerts"
            checked={notificationSettings.paymentAlerts}
            onChange={handleNotificationChange}
          />
          Enable payment notifications
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
          <button type="submit" className="save-button" disabled={loadings}>
            {loadings ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Grey transparent background
    zIndex: 9999, // Ensure the loader appears above everything else
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    padding: "20px 40px",
    borderRadius: "8px", // Rounded corners for the popup
  },
};

export default Notifications;
