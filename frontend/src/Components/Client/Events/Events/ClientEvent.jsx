import React, { useState, useEffect } from "react";
import ClientSidebar from "../../sidebar/ClientSidebar";
import ClientHeader from "../../header/ClientHeader";
import Filter from "./Filter";
import ExportCalendar from "./ExportCalendar";
import Popup from "./ListPopup";
import Stat from "./Stat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
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
  {
    id: 7,
    title: "Event 7",
    type: "upcoming",
    date: "2024-12-07",
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
  const [presentEvent, setPresentEvent] = useState(null); // Track the "present" event

  const pendingEvents = events.filter(
    (event) => event.bookingStatus === "Pending"
  );
  const upcomingEvents = events.filter((event) => event.type === "upcoming");
  const pastEvents = events.filter((event) => event.type === "past");

  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0]; // Format the date to 'YYYY-MM-DD'

    // Find today's event
    const presentEventToday = upcomingEvents.find(
      (event) => event.date === currentDateString
    );

    // If no event is found today, use the first upcoming event as fallback
    const fallbackEvent = upcomingEvents[0] || null;

    // Set presentEvent to either today's event or the fallback
    setPresentEvent(presentEventToday || fallbackEvent);
  }, [upcomingEvents]);

  const toggleEvent = (eventType) => {
    setActiveEvent(activeEvent === eventType ? null : eventType);
  };

  const handleStatBlockClick = (title, description, eventType) => {
    let eventList = [];
    let isArtistPopup = false; // Default is false
  
    if (eventType === "upcoming") {
      eventList = upcomingEvents;
    } else if (eventType === "past") {
      eventList = pastEvents;
    } else if (eventType === "bookedArtists") {
      isArtistPopup = true; // Enable artist-specific layout
      eventList = upcomingEvents.filter((event) =>
        event.bookedArtists.some((artist) => bookedArtists.includes(artist))
      );
    } else if (eventType === "totalSpent") {
      eventList = events.map((event) => ({
        title: event.title,
        date: event.date,
        cost: event.cost,
      }));
    } else {
      eventList = events; // For total events
    }
  
    setPopupContent({ title, description, eventList, isArtistPopup });
    setShowPopup(true);
  };  

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Calculate total spent for all events
  const totalSpent = events.reduce((acc, event) => acc + event.cost, 0);

  // Correct logic to get unique booked artists only from upcoming events
  const bookedArtists = Array.from(
    new Set(upcomingEvents.flatMap((event) => event.bookedArtists))
  );

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

          {/* Stats Section */}
          <Stat
            events={events}
            upcomingEvents={upcomingEvents}
            totalSpent={totalSpent}
            bookedArtists={bookedArtists}
            handleStatBlockClick={handleStatBlockClick}
          />

          {/* Present Event Section */}
          {presentEvent && (
            <div
              className={`events-bar ${
                activeEvent === "present" ? "open" : ""
              }`}
              onClick={() => toggleEvent("present")}
            >
              <h3>
                Present Event
                <span className="event-count">({presentEvent.length})</span>
              </h3>
              <FontAwesomeIcon
                icon={activeEvent === "present" ? faChevronUp : faChevronDown}
                className="arrow-icon"
              />
            </div>
          )}

          {/* Pending Events Section */}
          <div
            className={`events-bar ${activeEvent === "pending" ? "open" : ""}`}
            onClick={() => toggleEvent("pending")}
          >
            <h3>
              Pending Events{" "}
              <span className="event-count">({pendingEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "pending" ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </div>
          {activeEvent === "pending" && (
            <div className="events-container">
              {pendingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

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

        {/* Event Popup */}
        {showPopup && popupContent && (
          <Popup
            title={popupContent.title}
            events={popupContent.eventList}
            isArtistPopup={popupContent.isArtistPopup} // New prop for artist layout
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
}

export default ClientEvent;
