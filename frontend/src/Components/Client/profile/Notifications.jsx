import React from "react";
import "./Notifications.css";
import { useState, useEffect } from "react";


const Notifications = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      bookingUpdates: true,
    },
    smsNotifications: false,
    pushNotifications: true,
  });

  useEffect(() => {
    const storedNotificationSettings =
      JSON.parse(localStorage.getItem("clientNotificationSettings")) || {};
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      ...storedNotificationSettings,
    }));
  }, []);
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    if (name.startsWith("emailNotifications")) {
      const notificationType = name.split(".")[1];
      setNotificationSettings({
        ...notificationSettings,
        emailNotifications: {
          ...notificationSettings.emailNotifications,
          [notificationType]: checked,
        },
      });
    } else {
      setNotificationSettings({
        ...notificationSettings,
        [name]: checked,
      });
    }
  };
  const handleSaveChanges = () => {
    localStorage.setItem(
      "clientNotificationSettings",
      JSON.stringify(notificationSettings)
    );
    alert("Changes saved!");
  };

  return (
    <div className="profile-section">
      <h2>Notifications</h2>
      <form>
        <div className="form-section">
          <label>Email Notifications (Booking Updates)</label>
          <input
            type="checkbox"
            name="emailNotifications.bookingUpdates"
            checked={notificationSettings.emailNotifications.bookingUpdates}
            onChange={handleNotificationChange}
          />{" "}
          Receive booking update emails
        </div>

        <div className="form-section">
          <label>SMS Notifications</label>
          <input
            type="checkbox"
            name="smsNotifications"
            checked={notificationSettings.smsNotifications}
            onChange={handleNotificationChange}
          />{" "}
          Enable SMS notifications
        </div>

        <div className="form-section">
          <label>Push Notifications</label>
          <input
            type="checkbox"
            name="pushNotifications"
            checked={notificationSettings.pushNotifications}
            onChange={handleNotificationChange}
          />{" "}
          Enable push notifications
        </div>

        <div className="form-section">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="save-button"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Notifications;
