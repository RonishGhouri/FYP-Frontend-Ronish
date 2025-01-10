import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebaseConfig"; // Firestore configuration
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
import { useAuth } from "../../../authContext"; // Authentication context
import ArtistEventModal from "../../artist/ArtistEvent/ArtistEventModal"; // Import the modal component
import "./ArtistHeader.css";

const ArtistHeader = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [username, setUsername] = useState("Guest");
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/40"
  );
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Selected event for modal
  const [showEventModal, setShowEventModal] = useState(false); // Modal visibility
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
          setProfilePic(
            data.profilePicture || "https://via.placeholder.com/40"
          );
        } else {
          setUsername("Guest");
          setProfilePic("https://via.placeholder.com/40");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

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
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
          });

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

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      updatedNotifications.forEach(async (notification) => {
        const docRef = doc(db, "notifications", notification.id);
        await updateDoc(docRef, { isRead: true });
      });

      setNotifications(updatedNotifications);
      setShowNotifications(false); // Close dropdown after marking all as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification) return;

      const docRef = doc(db, "notifications", notification.id);
      await updateDoc(docRef, { isRead: true });

      if (notification.type === "event") {
        navigate("/artist/events", {
          state: { eventId: notification.eventId },
        });
      } else if (notification.type === "chat") {
        navigate("/artist/chats", { state: { chatId: notification.chatId } });
      } else if (notification.type === "payment") {
        navigate("/artist/payment");
      } else {
        alert("This notification does not have a specific redirect.");
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    } finally {
      setShowNotifications(false);
    }
  };

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
      snapshot.forEach(async (doc) => await deleteDoc(doc.ref));
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
      // Dropdown remains visible after deleting a single notification
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
    <header className="artist-dashboard-header">
      <div className="artist-greeting">
        <img src={profilePic} alt="Profile" className="artist-profile-pic" />
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

        {/* Notification Bell */}
        <div
          className="artist-notification-icon"
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
                  onClick={() => handleNotificationClick(notification)} // Wrap the function call in an arrow function
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

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <ArtistEventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)} // Close modal
        />
      )}
    </header>
  );
};

export default ArtistHeader;
