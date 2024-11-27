import { FaBell, FaSearch } from "react-icons/fa";
import "./ArtistHeader.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ArtistHeader = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null); // Reference for the notification dropdown
  const bellIconRef = useRef(null); // Reference for the bell icon
  const navigate = useNavigate();

  useEffect(() => {
    const getPakistaniTime = () => {
      const currentDate = new Date();
      const options = {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        hour12: false,
      };
      const timeInPakistan = new Intl.DateTimeFormat("en-US", options).format(
        currentDate
      );
      return parseInt(timeInPakistan);
    };

    const currentHour = getPakistaniTime();

    if (currentHour < 12) {
      setGreeting("Morning");
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting("Noon");
    } else {
      setGreeting("Evening");
    }

    const storedUsername = localStorage.getItem("username");
    const storedProfilePic = localStorage.getItem("profilePic");

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    } else {
      setProfilePic("https://via.placeholder.com/40");
    }

    const storedNotifications = JSON.parse(localStorage.getItem("notifications"));
    if (storedNotifications) {
      setNotifications(storedNotifications);
    } else {
      const initialNotifications = [
        { id: 1, type: "chat", message: "New message from Customer 1", isUnread: true },
        { id: 2, type: "event", message: "New event booking: 'Art Expo 2024'", isUnread: true },
        { id: 3, type: "payment", message: "Payment received for event", isUnread: true },
        { id: 4, type: "content", message: "New content uploaded successfully", isUnread: false },
      ];
      setNotifications(initialNotifications);
      localStorage.setItem("notifications", JSON.stringify(initialNotifications));
    }
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev); // Toggles open/close
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isUnread: false,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleNotificationClick = (notification) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notification.id ? { ...notif, isUnread: false } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    switch (notification.type) {
      case "chat":
        navigate("/artist/chats");
        break;
      case "event":
        navigate("/artist/bookings");
        break;
      case "payment":
        navigate("/artist/payment");
        break;
      case "content":
        navigate("/artist/content");
        break;
      default:
        break;
    }
    setShowNotifications(false);
  };

  const handleBellAndDotClick = (e) => {
    e.stopPropagation(); // Prevent event propagation to the document
    toggleNotifications();
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      bellIconRef.current &&
      !bellIconRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const unreadNotificationsCount = notifications.filter((n) => n.isUnread).length;

  return (
    <header className="artist-dashboard-header">
      <div className="artist-greeting">
        <img src={profilePic} alt="Profile" className="artist-profile-pic" />
        <h3>{greeting}, {username}</h3>
      </div>
      <div className="artist-top-right">
        <div className="artist-search-bar-container">
          <FaSearch className="artist-search-icon" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="artist-search-bar"
            readOnly
          />
        </div>

        {/* Notification Bell and Red Dot */}
        <div
          className="artist-notification-icon"
          onClick={handleBellAndDotClick}
          ref={bellIconRef} // Ref for the bell icon
        >
          <FaBell size={24} />
          {unreadNotificationsCount > 0 && (
            <span className="notification-count">
              {unreadNotificationsCount}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notifications-dropdown" ref={dropdownRef}>
            <div className="notifications-header">
              <h4>Notifications</h4>
              <button onClick={markAllAsRead}>Mark all as read</button>
            </div>
            <ul className="notifications-list">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className={notification.isUnread ? "unread" : ""}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default ArtistHeader;