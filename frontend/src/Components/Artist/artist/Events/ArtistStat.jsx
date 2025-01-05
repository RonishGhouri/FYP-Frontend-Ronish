import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faCoins,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import ArtistListPopup from "./ArtistListPopup";
import "./ArtistStat.css";

function ArtistStat({ events }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const upcomingEvents = events.filter((event) => event.type === "upcoming");
  const pastEvents = events.filter((event) => event.type === "past");

  const totalEarned = events.reduce((acc, event) => acc + event.cost, 0);
  const upcomingClients = Array.from(
    new Set(
      upcomingEvents.flatMap((event) =>
        event.bookedClients.map((client) => client.name)
      )
    )
  ).length;

  const handleStatBlockClick = (title, description, eventType) => {
    let eventList = [];
    let clientList = [];
    let popupType = "events";

    if (eventType === "upcoming") {
      eventList = upcomingEvents;
    } else if (eventType === "past") {
      eventList = pastEvents;
    } else if (eventType === "clients") {
      popupType = "clients";
      clientList = upcomingEvents.flatMap((event) =>
        event.bookedClients.map((client) => ({
          ...client,
          eventTitle: event.title,
        }))
      );
    } else {
      eventList = events;
    }

    setPopupContent({
      title,
      description,
      type: popupType,
      eventList,
      clientList,
    });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="artist-stats">
      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Total Events",
            
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faCalendarDay} className="artist-stat-icon" />
          <h3>Total Events</h3>
        </div>
        <p>{events.length}</p>
      </div>

      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Upcoming Events",
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faClock} className="artist-stat-icon" />
          <h3>Upcoming Events</h3>
        </div>
        <p>{upcomingEvents.length}</p>
      </div>

      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Total Earned",
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faCoins} className="artist-stat-icon" />
          <h3>Total Earned</h3>
        </div>
        <p>₨. {totalEarned}</p>
      </div>

      <div
        className="artist-stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Booked By Clients",
            `Number of unique clients who booked: ${upcomingClients}`,
            "clients"
          )
        }
      >
        <div className="artist-stat-icon-text">
          <FontAwesomeIcon icon={faHandshake} className="artist-stat-icon" />
          <h3>Booked By Clients</h3>
        </div>
        <p>{upcomingClients}</p>
      </div>

      {showPopup && (
        <ArtistListPopup content={popupContent} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default ArtistStat;
