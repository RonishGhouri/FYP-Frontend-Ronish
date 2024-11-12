import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './ArtistEvents.css'; // Assuming you'll create an appropriate CSS file for this
import ArtistSidebar from './sidebar/ArtistSidebar';
import ArtistHeader from './header/ArtistHeader';

const ArtistEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch artist's events from backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/artist/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="artist-dashboard">
      {/* Sidebar */}
      <ArtistSidebar/>

      {/* Main Dashboard Content */}
      <div className="artist-main-dashboard">
        {/* Top Bar */}
        <ArtistHeader/>

        {/* Events Section */}
        <div className="artist-events-section">
          <h3>Your Events</h3>
          <ul>
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event.id}>
                  {event.eventName} on {event.eventDate} at {event.venue}
                </li>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArtistEvents;
