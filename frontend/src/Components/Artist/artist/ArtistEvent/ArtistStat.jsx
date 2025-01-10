import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faCoins,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import ArtistListPopup from "./ArtistListPopup";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore imports
import { getAuth } from "firebase/auth";
import "./ArtistStat.css";

function ArtistStat({ events }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [totalEarned, setTotalEarned] = useState(0); // State for total earnings
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchTotalEarned = async () => {
      if (!userId) return;

      const db = getFirestore();
      const userDocRef = doc(db, "users", userId);

      try {
        setLoading(true);
        setError(null);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const totalEarnedFromDB = userDoc.data()?.totalEarned || 0;
          setTotalEarned(totalEarnedFromDB);
        } else {
          setError("User data not found.");
        }
      } catch (err) {
        console.error("Error fetching totalEarned:", err);
        setError("Failed to fetch total earnings data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEarned();
  }, [userId]);

  // Filter events by status
  const upcomingEvents = events.filter((event) => event.status === "Upcoming");
  const pastEvents = events.filter((event) => event.status === "Past");

  // Unique clients calculation
  const uniqueClients = [
    ...new Set(events.map((event) => event.clientName)),
  ].length;

  // Handle clicks on stat blocks
  const handleStatBlockClick = (title, description, eventType) => {
    let eventList = [];
    let popupType = "events";

    switch (eventType) {
      case "upcoming":
        eventList = upcomingEvents;
        break;
      case "past":
        eventList = pastEvents;
        break;
      case "clients":
        popupType = "clients";
        eventList = events.map((event) => ({
          clientName: event.clientName,
          clientProfilePicture: event.clientProfilePicture,
          eventType: event.eventType || "Unknown Type",
        }));
        break;
      case "totalEarned":
        eventList = events.map((event) => ({
          eventType: event.eventType || "N/A",
          date: event.date || "N/A",
          earning: event.earning || 0,
        }));
        break;
      default:
        eventList = events; // Total Events
    }

    setPopupContent({
      title,
      description,
      type: popupType,
      eventList,
    });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="artist-stats">
      {/* Total Events */}
      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Total Events",
            `Total number of events: ${events.length}`,
            "all"
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faCalendarDay} className="artist-stat-icon" />
          <h3>Total Events</h3>
        </div>
        <p>{events.length}</p>
      </div>

      {/* Upcoming Events */}
      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Upcoming Events",
            `Upcoming events: ${upcomingEvents.length}`,
            "upcoming"
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faClock} className="artist-stat-icon" />
          <h3>Upcoming Events</h3>
        </div>
        <p>{upcomingEvents.length}</p>
      </div>

      {/* Total Earned */}
      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Total Earned",
            `Total earnings: ₨${totalEarned}`,
            "totalEarned"
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faCoins} className="artist-stat-icon" />
          <h3>Total Earned (Rs)</h3>
        </div>
        <p>₨{totalEarned}</p>
      </div>

      {/* Booked Clients */}
      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Booked Clients",
            `Number of unique clients: ${uniqueClients}`,
            "clients"
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faHandshake} className="artist-stat-icon" />
          <h3>Booked Clients</h3>
        </div>
        <p>{uniqueClients}</p>
      </div>

      {/* Popup for events or clients */}
      {showPopup && (
        <ArtistListPopup content={popupContent} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default ArtistStat;
