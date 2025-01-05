import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './ArtistExportCalendar.css';  // Change the CSS file to use artist-specific styles

const ArtistExportCalendar = ({ events }) => {
  const generateICSFile = (events) => {
    let calendar = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Company//NONSGML v1.0//EN\n`;

    events.forEach((event) => {
      const startDate = new Date(event.date);
      const endDate = new Date(event.date); // Assuming single-day events; adjust for multi-day events
      endDate.setHours(startDate.getHours() + 1); // Assuming a 1-hour duration for the event; adjust as needed

      // Format the start and end dates in the correct format (YYYYMMDDTHHMMSSZ)
      const formattedStartDate = formatDateToICS(startDate); // e.g. 20241203T120000Z
      const formattedEndDate = formatDateToICS(endDate);     // e.g. 20241203T130000Z

      // Add a unique identifier (UID) for the event
      const uid = `event-${startDate.getTime()}@yourdomain.com`;

      // Log the generated ICS content for debugging
      console.log(`Generating event for ${event.title}`);
      console.log(`Start Date: ${formattedStartDate}`);
      console.log(`End Date: ${formattedEndDate}`);
      console.log(`UID: ${uid}`);

      calendar += `BEGIN:VEVENT\n`;
      calendar += `SUMMARY:${event.title}\n`;
      calendar += `DTSTART:${formattedStartDate}\n`; // Format as required for ICS
      calendar += `DTEND:${formattedEndDate}\n`;    // Adjust time zone accordingly
      calendar += `DESCRIPTION:${event.description || 'No description available.'}\n`;
      calendar += `LOCATION:${event.location || 'TBD'}\n`;
      calendar += `STATUS:CONFIRMED\n`;  // Event status (Confirmed)
      calendar += `SEQUENCE:0\n`;        // Sequence number (for future updates)
      calendar += `UID:${uid}\n`;       // Unique identifier for the event
      calendar += `BEGIN:VALARM\n`;
      calendar += `TRIGGER:-PT10M\n`;   // Reminder 10 minutes before the event
      calendar += `DESCRIPTION:Reminder\n`; 
      calendar += `ACTION:DISPLAY\n`;
      calendar += `END:VALARM\n`;
      calendar += `END:VEVENT\n`;
    });

    calendar += `END:VCALENDAR`;

    // Create a Blob with the calendar content
    const blob = new Blob([calendar], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'events.ics'; // Set the filename for the download
    link.click();
  };

  // Helper function to format date as required for .ics file
  const formatDateToICS = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;  // UTC time format with Z (Zulu time)
  };

  return (
    <div>
      <button className="artist-export-btn" onClick={() => generateICSFile(events)}>
        <FontAwesomeIcon icon={faCalendarAlt} className="artist-icon" />
        Export to Calendar
      </button>
    </div>
  );
};

export default ArtistExportCalendar;
