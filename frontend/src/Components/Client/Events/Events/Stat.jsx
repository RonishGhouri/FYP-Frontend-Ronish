import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faCoins,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import './Stat.css';


const Stat = ({
  events,
  upcomingEvents,
  totalSpent,
  bookedArtists,
  handleStatBlockClick,
}) => {
  return (
    <div className="stats">
      <div
        className="stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Total Events",
            `Total number of events: ${events.length}`,
            "all"
          )
        }
      >
        <div className="stat-icon-text">
          <FontAwesomeIcon icon={faCalendarDay} className="stat-icon" />
          <h3>Total Events</h3>
        </div>
        <p>{events.length}</p>
      </div>

      <div
        className="stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Upcoming Events",
            `Upcoming events: ${upcomingEvents.length}`,
            "upcoming"
          )
        }
      >
        <div className="stat-icon-text">
          <FontAwesomeIcon icon={faClock} className="stat-icon" />
          <h3>Upcoming Events</h3>
        </div>
        <p>{upcomingEvents.length}</p>
      </div>

      <div
        className="stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Total Spent",
            `Total amount spent: ₨${totalSpent}`,
            "all"
          )
        }
      >
        <div className="stat-icon-text">
          <FontAwesomeIcon icon={faCoins} className="stat-icon" />
          <h3>Total Spent</h3>
        </div>
        <p>₨. {totalSpent}</p>
      </div>

      <div
        className="stat-block"
        onClick={() =>
          handleStatBlockClick(
            "Booked Artists",
            `Artists booked for upcoming events: ${bookedArtists.length}`,
            "bookedArtists" // Ensure this matches the updated logic
          )
        }
      >
        <div className="stat-icon-text">
          <FontAwesomeIcon icon={faUser} className="stat-icon" />
          <h3>Booked Artists</h3>
        </div>
        <p>{bookedArtists.length}</p>
      </div>
    </div>
  );
};

export default Stat;