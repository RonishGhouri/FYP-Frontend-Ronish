import React, { useState, useEffect } from "react";
import ArtistSidebar from "../sidebar/ArtistSidebar";
import ArtistHeader from "../header/ArtistHeader";
import ArtistFilter from "./ArtistFilter";
import ArtistExportCalendar from "./ArtistExportCalendar";
import EventCard from "./ArtistEventCard";
import ArtistStat from "./ArtistStat"; // Import the new ArtistStat component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./ArtistEvents.css";

const events = [
  {
    id: 1,
    title: "Wedding Performance",
    type: "upcoming",
    eventType: "Wedding",
    date: "2024-12-15",
    time: "6:00 PM",
    Address: "123 Wedding Street, City, Country",
    cost: 200,
    bookedClients: [
      {
        name: "Client A",
        email: "clienta@example.com",
        phone: "123-456-7890",
      },
    ],
    bookingStatus: "Confirmed",
    paymentStatus: "Completed",
    eventDetails: "classical music during dinner.",
  },
  {
    id: 2,
    title: "Corporate Event Performance",
    type: "upcoming",
    eventType: "Corporate",
    date: "2024-12-20",
    time: "8:00 PM",
    Address: "456 Business Road, City, Country",
    cost: 300,
    bookedClients: [
      {
        name: "Client B",
        email: "clientb@example.com",
        phone: "987-654-3210",
      },
    ],
    bookingStatus: "Pending",
    paymentStatus: "Pending",
    eventDetails: "jazz music for the networking session.",
  },
  {
    id: 3,
    title: "Birthday Party Performance",
    type: "past",
    eventType: "Birthday",
    date: "2024-10-15",
    time: "5:00 PM",
    Address: "789 Fun Ave, City, Country",
    cost: 150,
    bookedClients: [
      {
        name: "Client C",
        email: "clientc@example.com",
        phone: "555-555-5555",
      },
    ],
    bookingStatus: "Completed",
    paymentStatus: "Completed",
    eventDetails: "a mix of upbeat and classical music.",
  },
];

function ArtistEvent() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [presentEvent, setPresentEvent] = useState(null);

  const pendingEvents = events.filter(
    (event) => event.bookingStatus === "Pending"
  );
  const upcomingEvents = events.filter((event) => event.type === "upcoming");
  const pastEvents = events.filter((event) => event.type === "past");

  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    const presentEventToday = upcomingEvents.find(
      (event) => event.date === currentDateString
    );

    if (!presentEventToday) {
      const closestUpcomingEvent = upcomingEvents.reduce((closest, event) => {
        const eventDate = new Date(event.date);
        if (
          eventDate >= currentDate &&
          (!closest || eventDate < new Date(closest.date))
        ) {
          return event;
        }
        return closest;
      }, null);
      setPresentEvent(closestUpcomingEvent);
    } else {
      setPresentEvent(presentEventToday);
    }
  }, [upcomingEvents]);

  const toggleEvent = (eventType) => {
    setActiveEvent(activeEvent === eventType ? null : eventType);
  };

  return (
    <div className="artist-event-dashboard">
      <ArtistSidebar />
      <div className="artist-event-main-dashboard">
        <ArtistHeader />
        <div className="artist-event-main-content">
          <div className="artist-events-header">
            <h2 className="artist-section-title">Events</h2>
            <div className="artist-header-actions">
              <ArtistFilter />
              <ArtistExportCalendar events={events} />
            </div>
          </div>

          {/* Artist Stats Section */}
          <ArtistStat events={events} />

          <div
            className={`artist-events-bar ${
              activeEvent === "present" ? "open" : ""
            }`}
            onClick={() => toggleEvent("present")}
          >
            <h3>
              Present Event <span>({presentEvent ? 1 : 0})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "present" ? faChevronUp : faChevronDown}
              className="artist-arrow-icon"
            />
          </div>
          {activeEvent === "present" && (
            <div className="artist-events-container">
              {presentEvent ? (
                <EventCard key={presentEvent.id} event={presentEvent} />
              ) : (
                <p>No present event for today.</p>
              )}
            </div>
          )}

          <div
            className={`artist-events-bar ${
              activeEvent === "pending" ? "open" : ""
            }`}
            onClick={() => toggleEvent("pending")}
          >
            <h3>
              Pending Events <span>({pendingEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "present" ? faChevronUp : faChevronDown}
              className="artist-arrow-icon"
            />
          </div>
          {activeEvent === "pending" && (
            <div className="artist-events-container">
              {pendingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div
            className={`artist-events-bar ${
              activeEvent === "upcoming" ? "open" : ""
            }`}
            onClick={() => toggleEvent("upcoming")}
          >
            <h3>
              Upcoming Events <span>({upcomingEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "present" ? faChevronUp : faChevronDown}
              className="artist-arrow-icon"
            />
          </div>
          {activeEvent === "upcoming" && (
            <div className="artist-events-container">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div
            className={`artist-events-bar ${
              activeEvent === "past" ? "open" : ""
            }`}
            onClick={() => toggleEvent("past")}
          >
            <h3>
              Past Events <span>({pastEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "present" ? faChevronUp : faChevronDown}
              className="artist-arrow-icon"
            />
          </div>
          {activeEvent === "past" && (
            <div className="artist-events-container">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistEvent;
