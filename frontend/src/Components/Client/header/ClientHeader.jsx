import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebaseConfig"; // Firestore configuration
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../authContext"; // Authentication context
import "./ClientHeader.css";

const ClientHeader = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null); // Reference for the notification dropdown
  const bellIconRef = useRef(null); // Reference for the bell icon
  const [showProfileInformation, setShowProfileInformation] = useState(false);
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

    // Fetch profile data from Firestore
    const fetchProfile = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || "");
          setProfilePic(
            data.profilePicture || "https://via.placeholder.com/40"
          );
        } else {
          console.log("No profile data found!");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    // Fetch notifications from Firestore
    const fetchNotifications = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "notifications", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNotifications(docSnap.data().notifications || []);
        } else {
          console.log("No notifications found!");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchProfile();
    fetchNotifications();
  }, [currentUser]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev); // Toggles open/close
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnread: false,
    }));

    setNotifications(updatedNotifications);

    // Update notifications in Firestore
    try {
      const docRef = doc(db, "notifications", currentUser.uid);
      await updateDoc(docRef, { notifications: updatedNotifications });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notification.id ? { ...notif, isUnread: false } : notif
    );

    setNotifications(updatedNotifications);

    // Update notifications in Firestore
    try {
      const docRef = doc(db, "notifications", currentUser.uid);
      await updateDoc(docRef, { notifications: updatedNotifications });
    } catch (error) {
      console.error("Error updating notifications:", error);
    }

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

  const unreadNotificationsCount = notifications.filter(
    (n) => n.isUnread
  ).length;

  
  return (
    <header className="artist-dashboard-header">
      <div className="artist-greeting">
        <img
          src={profilePic}
          alt="Profile"
          className="artist-profile-pic"
          
        />
        <h3>
          {greeting}, {username}
        </h3>
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

export default ClientHeader;
