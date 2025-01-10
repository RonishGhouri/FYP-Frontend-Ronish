import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Firestore configuration
import { useAuth } from "../../authContext"; // Authentication context
import "./ClientHeader.css";

const ClientHeader = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [username, setUsername] = useState("Guest");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/40");
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null); // Reference for the notification dropdown
  const bellIconRef = useRef(null); // Reference for the bell icon
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
      const timeInPakistan = new Intl.DateTimeFormat("en-US", options).format(
        currentDate
      );
      return parseInt(timeInPakistan, 10);
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
      if (!currentUser || !currentUser.uid) {
        setUsername("Guest");
        setProfilePic("https://via.placeholder.com/40");
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.name || "Guest");
          setProfilePic(data.profilePicture || "https://via.placeholder.com/40");
        } else {
          setUsername("Guest");
          setProfilePic("https://via.placeholder.com/40");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    // Fetch notifications in real-time
    const fetchNotifications = () => {
      if (!currentUser) return;

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("recipientId", "==", currentUser.uid)
      );

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const fetchedNotifications = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotifications(fetchedNotifications);
      });

      return unsubscribe;
    };

    fetchProfile();
    const unsubscribeNotifications = fetchNotifications();

    return () => {
      if (unsubscribeNotifications) unsubscribeNotifications();
    };
  }, [currentUser]);

  // Toggle Notifications Dropdown
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Mark All Notifications as Read
  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      setNotifications(updatedNotifications);

      for (const notification of notifications) {
        const docRef = doc(db, "notifications", notification.id);
        await updateDoc(docRef, { isRead: true });
      }

      setShowNotifications(false); // Close dropdown after marking all as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Handle Notification Click
  const handleNotificationClick = async (notification) => {
    try {
      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, { isRead: true });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );

      if (notification.chatId) {
        navigate("/client/chats", { state: { chatId: notification.chatId } });
      } else if (notification.bookingId) {
        navigate("/client/bookings", { state: { bookingId: notification.bookingId } });
      } else {
        switch (notification.type) {
          case "payment":
            navigate("/client/payment");
            break;
          default:
            console.warn("Unknown notification type:", notification.type);
            break;
        }
      }
    } catch (error) {
      console.error("Error updating notification as read:", error);
    } finally {
      setShowNotifications(false);
    }
  };

  // Handle outside clicks for closing dropdown
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

  const deleteAllNotifications = async () => {
    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("recipientId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(notificationsQuery);
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
      setNotifications([]);
      setShowNotifications(false); // Close dropdown after deleting all notifications
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
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
    (n) => !n.isRead
  ).length;

  return (
    <header className="client-dashboard-header">
      <div className="client-greeting">
        <img src={profilePic} alt="Profile" className="client-profile-pic" />
        <h3>
          {greeting}, {username}
        </h3>
      </div>
      <div className="client-top-right">
        <div className="client-search-bar-container">
          <FaSearch className="client-search-icon" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="client-search-bar"
            readOnly
          />
        </div>

        {/* Notification Bell */}
        <div
          className="client-notification-icon"
          onClick={toggleNotifications}
          ref={bellIconRef}
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
              <button onClick={deleteAllNotifications}>Delete All</button>
            </div>
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={notification.isRead ? "" : "unread"}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.message}
                  <button
                    className="delete-notification"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click event
                      deleteNotification(notification.id);
                    }}
                  >
                    X
                  </button>
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
