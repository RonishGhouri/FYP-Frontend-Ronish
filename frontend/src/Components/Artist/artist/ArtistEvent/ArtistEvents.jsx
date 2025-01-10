import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access state
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore"; // Firebase imports
import { getAuth } from "firebase/auth";
import ArtistSidebar from "../sidebar/ArtistSidebar";
import ArtistHeader from "../header/ArtistHeader";
import ArtistFilter from "./ArtistFilter";
import ArtistExportCalendar from "./ArtistExportCalendar";
import ArtistEventCard from "./ArtistEventCard";
import ArtistEventModal from "./ArtistEventModal"; // Import the modal component
import ArtistStat from "./ArtistStat"; // Import the ArtistStat component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./ArtistEvents.css";

function ArtistEvent() {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [presentEvent, setPresentEvent] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedEvent, setSelectedEvent] = useState(null); // Modal state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const location = useLocation(); // Access the state from navigation
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const fetchEvents = async () => {
    if (!userId) return;

    const db = getFirestore();
    const eventsCollection = collection(db, "events");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      // Query events where artistId matches the authenticated user ID
      const q = query(eventsCollection, where("artistId", "==", userId));
      const eventsSnapshot = await getDocs(q);

      const fetchedEvents = [];
      for (const eventDoc of eventsSnapshot.docs) {
        const eventData = eventDoc.data();
        const eventDate = new Date(eventData.eventStartDate);

        // Reset time for accurate comparison
        eventDate.setHours(0, 0, 0, 0);

        // Determine the status based on the date
        let status = eventData.status;
        if (eventData.bookingStatus === "Cancelled") {
          status = "Cancelled";
        } else if (eventDate.getTime() === today.getTime()) {
          status = "Present";
        } else if (eventDate < today) {
          status = "Past";
        } else {
          status = "Upcoming";
        }

        // Update the status in Firestore if it has changed
        if (eventData.status !== status) {
          await updateDoc(doc(db, "events", eventDoc.id), { status });
        }

        // Prepare event object for state
        fetchedEvents.push({
          id: eventDoc.id,
          eventDetails: eventData.eventDetails || "No Event Details",
          clientProfilePicture: eventData.clientProfilePicture,
          clientName: eventData.clientName,
          eventType: eventData.eventType || "Unknown Type",
          date: eventData.eventStartDate || "No Date",
          time: eventData.eventStartTime || "No Time",
          venue: eventData.venue || "No Venue",
          earning: eventData.artistCharges || 0,
          bookingStatus: eventData.bookingStatus || "Unknown",
          eventCompleted: eventData.clientCompleted,
          status, // Include the updated status
        });
      }

      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventId) => {
    const db = getFirestore();
    try {
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        setSelectedEvent({ id: eventId, ...eventSnap.data() });
        setShowModal(true); // Show the modal
      } else {
        console.error("Event not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  useEffect(() => {
    // Check if there's an eventId in the location state
    if (location.state?.eventId) {
      fetchEventDetails(location.state.eventId);
    }
  }, [location.state?.eventId]);

  // Filter events by type
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset to midnight for comparison

    const filteredPresentEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Reset event date to midnight

      // Check if the event date matches the current date
      return eventDate.getTime() === currentDate.getTime();
    });

    setPresentEvent(filteredPresentEvents);
  }, [events]);

  const cancelledEvents = events.filter(
    (event) => event.status === "Cancelled"
  );
  const upcomingEvents = events.filter(
    (event) => event.status === "Upcoming" && !presentEvent.includes(event)
  ); // Exclude present events from upcoming
  const pastEvents = events.filter((event) => event.status === "Past");

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

          {/* Show loading or error states */}
          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              {/* Artist Stats Section */}
              <ArtistStat events={events} />

              {/* Present Events */}
              <div
                className={`artist-events-bar ${
                  activeEvent === "present" ? "open" : ""
                }`}
                onClick={() => toggleEvent("present")}
              >
                <h3>
                  Present Events <span>({presentEvent.length})</span>
                </h3>
                <FontAwesomeIcon
                  icon={activeEvent === "present" ? faChevronUp : faChevronDown}
                  className="artist-arrow-icon"
                />
              </div>
              {activeEvent === "present" && (
                <div className="artist-events-container">
                  {presentEvent.length > 0 ? (
                    presentEvent.map((event) => (
                      <ArtistEventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p>No present events for today.</p>
                  )}
                </div>
              )}

              {/* Cancelled Events */}
              <div
                className={`artist-events-bar ${
                  activeEvent === "cancelled" ? "open" : ""
                }`}
                onClick={() => toggleEvent("cancelled")}
              >
                <h3>
                  Cancelled Events <span>({cancelledEvents.length})</span>
                </h3>
                <FontAwesomeIcon
                  icon={
                    activeEvent === "cancelled" ? faChevronUp : faChevronDown
                  }
                  className="artist-arrow-icon"
                />
              </div>
              {activeEvent === "cancelled" && (
                <div className="artist-events-container">
                  {cancelledEvents.map((event) => (
                    <ArtistEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}

              {/* Upcoming Events */}
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
                  icon={
                    activeEvent === "upcoming" ? faChevronUp : faChevronDown
                  }
                  className="artist-arrow-icon"
                />
              </div>
              {activeEvent === "upcoming" && (
                <div className="artist-events-container">
                  {upcomingEvents.map((event) => (
                    <ArtistEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}

              {/* Past Events */}
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
                  icon={activeEvent === "past" ? faChevronUp : faChevronDown}
                  className="artist-arrow-icon"
                />
              </div>
              {activeEvent === "past" && (
                <div className="artist-events-container">
                  {pastEvents.map((event) => (
                    <ArtistEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showModal && selectedEvent && (
        <ArtistEventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ArtistEvent;
