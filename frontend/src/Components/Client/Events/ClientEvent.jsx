import React, { useState } from "react";
import ClientSidebar from "../sidebar/ClientSidebar";
import ClientHeader from "../header/ClientHeader";
import Filter from "./Filter";
import ExportCalendar from "./ExportCalendar";
import Popup from "./ListPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock, faChevronDown, faChevronUp, faCoins, faUser, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"; 
import EventCard from "./EventCard"; // Import EventCard
import "./ClientEvent.css";

// Sample event data
const events = [
  {
    id: 1,
    title: "Event 1",
    type: "upcoming",
    date: "2024-12-15",
    time: "6:00 PM",
    venue: "Venue 1",
    cost: 200,
    bookedArtists: ["Artist A", "Artist D"],
    description: "This is the description of event 1.",
    bookingStatus: "Confirmed",
    paymentStatus: "Completed",
  },
  {
    id: 2,
    title: "Event 2",
    type: "upcoming",
    date: "2024-12-20",
    time: "8:00 PM",
    venue: "Venue 2",
    cost: 300,
    bookedArtists: ["Artist B", "Artist A"],
    description: "This is the description of event 2.",
    bookingStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    id: 3,
    title: "Event 3",
    type: "past",
    date: "2024-10-15",
    time: "5:00 PM",
    venue: "Venue 3",
    cost: 150,
    bookedArtists: ["Artist C"],
    description: "This is the description of event 3.",
    bookingStatus: "Completed",
    paymentStatus: "Completed",
  },
  {
    id: 4,
    title: "Event 4",
    type: "past",
    date: "2024-09-20",
    time: "7:00 PM",
    venue: "Venue 4",
    cost: 250,
    bookedArtists: ["Artist D"],
    description: "This is the description of event 4.",
    bookingStatus: "Confirmed",
    paymentStatus: "Completed",
  },
  {
    id: 5,
    title: "Event 5",
    type: "past",
    date: "2024-08-25",
    time: "9:00 PM",
    venue: "Venue 5",
    cost: 100,
    bookedArtists: ["Artist E"],
    description: "This is the description of event 5.",
    bookingStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    id: 6,
    title: "Event 6",
    type: "upcoming",
    date: "2024-08-25",
    time: "9:00 PM",
    venue: "Venue 6",
    cost: 100,
    bookedArtists: ["Artist F"],
    bookingStatus: "Confirmed",
    paymentStatus: "Pending",
  },
];

function ClientEvent() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const upcomingEvents = events.filter((event) => event.type === "upcoming");
  const pastEvents = events.filter((event) => event.type === "past");

  const toggleEvent = (eventType) => {
    setActiveEvent(activeEvent === eventType ? null : eventType);
  };

  const handleExportCalendar = () => {
    console.log("Exporting to calendar...");
  };

  const handleStatBlockClick = (title, description, eventType) => {
    let eventList = [];
    if (eventType === "upcoming") {
      eventList = upcomingEvents;
    } else if (eventType === "past") {
      eventList = pastEvents;
    } else {
      eventList = events; // For total events
    }
    setPopupContent({ title, description, eventList });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Calculate total spent for all events
  const totalSpent = events.reduce((acc, event) => acc + event.cost, 0);

  // Correct logic to get unique booked artists only from upcoming events
  const bookedArtists = Array.from(new Set(upcomingEvents.flatMap((event) => event.bookedArtists)));

  return (
    <div className="clientEvent-dashboard">
      <ClientSidebar />
      <div className="clientEvent-main-dashboard">
        <ClientHeader />

        <div className="main-content">
          <div className="events-header">
            <h2 className="section-title">Events</h2>
            <div className="header-actions">
              <Filter />
              <ExportCalendar events={events} />
            </div>
          </div>

          <div className="stats">
            <div
              className="stat-block"
              onClick={() =>
                handleStatBlockClick("Total Events", `Total number of events: ${events.length}`, "all")
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
                handleStatBlockClick("Upcoming Events", `Upcoming events: ${upcomingEvents.length}`, "upcoming")
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
                handleStatBlockClick("Total Spent", `Total amount spent: ₨${totalSpent}`, "all")
              }
            >
              <div className="stat-icon-text">
                <FontAwesomeIcon icon={faCoins} className="stat-icon" />
                <h3>Total Spent</h3>
              </div>
              <p>₨{totalSpent}</p>
            </div>

            <div
              className="stat-block"
              onClick={() =>
                handleStatBlockClick("Booked Artists", `Artists booked for upcoming events: ${bookedArtists.length}`, "all")
              }
            >
              <div className="stat-icon-text">
                <FontAwesomeIcon icon={faUser} className="stat-icon" />
                <h3>Booked Artists</h3>
              </div>
              <p>{bookedArtists.length}</p>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div
            className={`events-bar ${activeEvent === "upcoming" ? "open" : ""}`}
            onClick={() => toggleEvent("upcoming")}
          >
            <h3>
              Upcoming Events{" "}
              <span className="event-count">({upcomingEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "upcoming" ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </div>
          {activeEvent === "upcoming" && (
            <div className="events-container">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Past Events Section */}
          <div
            className={`events-bar ${activeEvent === "past" ? "open" : ""}`}
            onClick={() => toggleEvent("past")}
          >
            <h3>
              Past Events{" "}
              <span className="event-count">({pastEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "past" ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </div>
          {activeEvent === "past" && (
            <div className="events-container">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {showPopup && (
          <Popup
            title={popupContent.title}
            description={popupContent.description}
            events={popupContent.eventList}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
}

export default ClientEvent;
