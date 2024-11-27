import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ClientHeader.css";

const ClientHeader = ({ onSearch, pageContext }) => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [placeholder, setPlaceholder] = useState("Search for anything...");
  const dropdownRef = useRef(null);
  const bellIconRef = useRef(null);
  const navigate = useNavigate();

  // Set greeting based on time
  useEffect(() => {
    const getPakistaniTime = () => {
      const currentDate = new Date();
      const options = {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        hour12: false,
      };
      const timeInPakistan = new Intl.DateTimeFormat("en-US", options).format(currentDate);
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
  }, []);

  // Load user data and notifications
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfilePic = localStorage.getItem("profilePic");
    const storedNotifications = JSON.parse(localStorage.getItem("notifications"));

    setUsername(storedUsername || "User");
    setProfilePic(storedProfilePic || "https://via.placeholder.com/40");

    if (storedNotifications) {
      setNotifications(storedNotifications);
    } else {
      const initialNotifications = [
        { id: 1, type: "chat", message: "New message from Customer 1", isUnread: true },
        { id: 2, type: "event", message: "New event booking confirmed", isUnread: true },
        { id: 3, type: "payment", message: "Payment received for event", isUnread: true },
        { id: 4, type: "content", message: "New content uploaded successfully", isUnread: false },
      ];
      setNotifications(initialNotifications);
      localStorage.setItem("notifications", JSON.stringify(initialNotifications));
    }
  }, []);

  // Dynamic placeholder based on page context
  useEffect(() => {
    switch (pageContext) {
      case "Browse Artists":
        setPlaceholder("Search for artists...");
        break;
      case "Manage Profile":
        setPlaceholder("Search in profile settings...");
        break;
      case "Manage Bookings":
        setPlaceholder("Search bookings...");
        break;
      case "Chats":
        setPlaceholder("Search chat history...");
        break;
      default:
        setPlaceholder("Search for anything...");
        break;
    }
  }, [pageContext]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnread: false,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notification.id ? { ...notif, isUnread: false } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    switch (notification.type) {
      case "chat":
        navigate("/client/chats");
        break;
      case "event":
        navigate("/client/bookings");
        break;
      case "payment":
        navigate("/client/payment");
        break;
      case "content":
        navigate("/client/content");
        break;
      default:
        break;
    }
    setShowNotifications(false);
  };

  // Handle outside click for notifications dropdown
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
    <header className="client-dashboard-header">
      <div className="client-greeting">
        <img src={profilePic} alt="Profile" className="client-profile-pic" />
        <h3>{greeting}, {username}</h3>
      </div>
      <div className="client-top-right">
        <div className="client-search-bar-container">
          <FaSearch className="client-search-icon" />
          <input
            type="text"
            placeholder={placeholder}
            className="client-search-bar"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>

        <div
          className="client-notification-icon"
          onClick={toggleNotifications}
          ref={bellIconRef}
        >
          <FaBell size={24} />
          {unreadNotificationsCount > 0 && (
            <span className="notification-count">{unreadNotificationsCount}</span>
          )}
        </div>

        {showNotifications && (
          <div className="notifications-dropdown" ref={dropdownRef}>
            <div className="notifications-header">
              <h4>Notifications</h4>
              <button onClick={markAllAsRead}>Mark all as read</button>
            </div>
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
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

export default ClientHeader;
