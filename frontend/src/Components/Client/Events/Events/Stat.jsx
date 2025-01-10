import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faCoins,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./Stat.css";

const Stat = ({
  events = [], // Default to an empty array
  upcomingEvents = [], // Default to an empty array
  totalSpent = 0, // Default to 0
  bookedArtists = [], // Default to an empty array
  handleStatBlockClick,
}) => {
  const stats = [
    {
      title: "Total Events",
      description: `Total number of events: ${events.length}`,
      value: events.length,
      icon: faCalendarDay,
      type: "all",
    },
    {
      title: "Upcoming Events",
      description: `Upcoming events: ${upcomingEvents.length}`,
      value: upcomingEvents.length,
      icon: faClock,
      type: "upcoming",
    },
    {
      title: "Total Spent",
      description: `Total amount spent: ₨${totalSpent}`,
      value: `₨${totalSpent}`,
      icon: faCoins,
      type: "totalSpent",
    },
    {
      title: "Booked Artists",
      description: `Artists booked for upcoming events: ${bookedArtists.length}`,
      value: bookedArtists.length,
      icon: faUser,
      type: "bookedArtists",
    },
  ];

  return (
    <div className="stats">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-block"
          onClick={() =>
            handleStatBlockClick(stat.title, stat.description, stat.type)
          }
        >
          <div className="stat-icon-text">
            <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
            <h3>{stat.title}</h3>
          </div>
          <p>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Stat;
