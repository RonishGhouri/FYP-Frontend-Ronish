import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ClientSidebar from "../../sidebar/ClientSidebar";
import ClientHeader from "../../header/ClientHeader";
import Filter from "./Filter";
import ExportCalendar from "./ExportCalendar";
import Popup from "./ListPopup";
import Stat from "./Stat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import EventCard from "./EventCard";
import "./ClientEvent.css";

function ClientEvent() {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [presentEvents, setPresentEvents] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [bookedArtists, setBookedArtists] = useState([]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch total spent by the client
  useEffect(() => {
    const fetchTotalSpent = async () => {
      if (!userId) return;

      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setTotalSpent(userData.totalSpent || 0);
        } else {
          console.error("No such user document found.");
        }
      } catch (error) {
        console.error("Error fetching totalSpent:", error);
      }
    };

    fetchTotalSpent();
  }, [userId]);

  // Fetch events from Firebase
  const fetchEvents = async () => {
    const db = getFirestore();
    const eventsCollection = collection(db, "events");

    try {
      const eventsSnapshot = await getDocs(eventsCollection);
      const fetchedEvents = [];
      const artistSet = new Map(); // Use a Map to store unique artists with all required fields

      for (const eventDoc of eventsSnapshot.docs) {
        const eventData = eventDoc.data();
        const eventDate = new Date(eventData.eventStartDate);
        eventDate.setHours(0, 0, 0, 0);

        // Determine event status
        let status = "Upcoming";
        if (eventData.bookingStatus === "Cancelled") {
          status = "Cancelled";
        } else if (eventDate.getTime() === today.getTime()) {
          status = "Present";
        } else if (eventDate < today) {
          status = "Past";
        }

        // Update artistSet with artist details
        if (eventData.artistName) {
          artistSet.set(eventData.artistName, {
            artistName: eventData.artistName,
            profilePicture:
              eventData.artistProfilePicture ||
              "https://via.placeholder.com/50",
            eventType: eventData.eventType || "No Type",
          });
        }

        // Update Firestore if status has changed
        if (eventData.status !== status) {
          await updateDoc(doc(db, "events", eventDoc.id), { status });
        }

        fetchedEvents.push({
          id: eventDoc.id,
          eventType: eventData.eventType || "Unknown Type",
          artistName: eventData.artistName || "No Artist",
          date: eventData.eventStartDate || "No Date",
          time: eventData.eventStartTime || "No Time",
          venue: eventData.venue || "No Venue",
          cost: eventData.cost || 0,
          bookingStatus: eventData.bookingStatus,
          description: eventData.eventDetails,
          status,
        });
      }

      setEvents(fetchedEvents);
      setBookedArtists(Array.from(artistSet.values())); // Convert Map values to array
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(
    (event) => event.status === "Upcoming" && new Date(event.date) > today
  );

  const pastEvents = events.filter(
    (event) => event.status === "Past" && new Date(event.date) < today
  );

  const presentEventsList = events.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0); // Reset event date to midnight for comparison
    return eventDate.getTime() === today.getTime();
  });

  const cancelledEvents = events.filter(
    (event) => event.status === "Cancelled"
  );

  useEffect(() => {
    setPresentEvents(presentEventsList);
  }, [events]);

  const toggleEvent = (eventType) => {
    setActiveEvent(activeEvent === eventType ? null : eventType);
  };

  const handleStatBlockClick = (title, description, type) => {
    let eventList = [];

    switch (type) {
      case "all":
        eventList = events;
        break;
      case "upcoming":
        eventList = upcomingEvents;
        break;
      case "past":
        eventList = pastEvents;
        break;
      case "present":
        eventList = presentEvents;
        break;
      case "cancelled":
        eventList = cancelledEvents;
        break;
      case "totalSpent":
        eventList = events.map((event) => ({
          eventType: event.eventType,
          date: event.date,
          cost: event.cost,
        }));
        break;
      case "bookedArtists":
        eventList = bookedArtists; // Ensure bookedArtists contains all necessary fields
        break;
      default:
        break;
    }

    setPopupContent({
      title,
      description,
      eventList,
      isArtistPopup: type === "bookedArtists",
    });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

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

          {/* Event Sections */}
          <div
            className={`events-bar ${activeEvent === "present" ? "open" : ""}`}
            onClick={() => toggleEvent("present")}
          >
            <h3>
              Present Events{" "}
              <span className="event-count">({presentEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "present" ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </div>
          {activeEvent === "present" && (
            <div className="events-container">
              {presentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Cancelled Events */}
          <div
            className={`events-bar ${
              activeEvent === "cancelled" ? "open" : ""
            }`}
            onClick={() => toggleEvent("cancelled")}
          >
            <h3>
              Cancelled Events{" "}
              <span className="event-count">({cancelledEvents.length})</span>
            </h3>
            <FontAwesomeIcon
              icon={activeEvent === "cancelled" ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </div>
          {activeEvent === "cancelled" && (
            <div className="events-container">
              {cancelledEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Upcoming Events */}
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

          {/* Past Events */}
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

        {/* Popup */}
        {showPopup && popupContent && (
          <Popup
            title={popupContent.title}
            events={popupContent.eventList}
            isArtistPopup={popupContent.isArtistPopup}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
}

export default ClientEvent;
