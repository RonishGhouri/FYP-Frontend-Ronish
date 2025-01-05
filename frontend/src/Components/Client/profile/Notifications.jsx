import React, { useState, useEffect } from "react";
import { useAuth } from "../../authContext"; // Use your authentication context
import { db } from "../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import "./Notifications.css";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

function Notifications() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    chatMessageNotifications: false,
    bookingNotifications: false,
    paymentNotifications: false,
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
          }));
        } else {
          console.log("No notification settings found!");
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        toast.error("Failed to fetch notification settings. Please try again.");
      } finally {
        setLoading(false);
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
    setIsSaving(true);

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { notificationSettings }, { merge: true });
      toast.success("Notification settings updated successfully!");
    } catch (error) {
      toast.error("Failed to save notification settings. Please try again.");
    } finally {
      setIsSaving(false);
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
      <form onSubmit={handleSaveChanges}>
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

        <div className="form-section">
          <label>Booking Notifications</label>
          <input
            type="checkbox"
            name="bookingNotifications"
            checked={notificationSettings.bookingNotifications}
            onChange={handleNotificationChange}
          />
          Enable booking notifications
        </div>

        <div className="form-section">
          <label>Payment Notifications</label>
          <input
            type="checkbox"
            name="paymentNotifications"
            checked={notificationSettings.paymentNotifications}
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
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
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
