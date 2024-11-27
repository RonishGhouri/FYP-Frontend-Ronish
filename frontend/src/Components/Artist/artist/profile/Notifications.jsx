import React from "react";
import  { useState, useEffect } from "react";

import "./Notifications.css";

function Notifications() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      marketing: false,
      bookingUpdates: true,
    },
    smsNotifications: false,
    pushNotifications: true,
    soundAlerts: false,
  });

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notificationSettings");
    const parsedNotifications = storedNotifications
      ? JSON.parse(storedNotifications)
      : {};

    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      ...parsedNotifications,
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
  


  const handleSaveChanges = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(notificationSettings)
    );
  };
  return (
    <div className="profile-section">
      <h2>Notifications</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Email Notifications (Marketing)</label>
          <input
            type="checkbox"
            name="emailNotifications.marketing"
            checked={notificationSettings.emailNotifications.marketing}
            onChange={handleNotificationChange}
          />{" "}
          Receive marketing emails
        </div>

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
          <label>Sound Alerts</label>
          <input
            type="checkbox"
            name="soundAlerts"
            checked={notificationSettings.soundAlerts}
            onChange={handleNotificationChange}
          />{" "}
          Enable sound alerts for notifications
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
}

export default Notifications;
