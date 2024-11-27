// src/components/ClientBrowserArtist.jsx
import React, { useState, useEffect } from "react";
import ClientSidebar from "../sidebar/ClientSidebar";
import ClientHeader from "../header/ClientHeader";
import "./ClientBrowserArtist.css";
import ArtistCard from "./ArtistCard";
import ArtistDetailPage from "./ArtistDetailPage";
import BookingForm from "./BookingForm";
import mockArtists from "./mockArtists";

function ClientBrowserArtist() {
  const [artists, setArtists] = useState(mockArtists);
  const [filteredArtists, setFilteredArtists] = useState(mockArtists);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Mock client information
  const clientInfo = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  // Filtering logic
  useEffect(() => {
    let results = artists;

    if (searchQuery) {
      results = results.filter((artist) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      results = results.filter((artist) =>
        artist.category.includes(categoryFilter)
      );
    }

    if (genreFilter) {
      results = results.filter((artist) => artist.genre.includes(genreFilter));
    }

    if (locationFilter) {
      results = results.filter((artist) => artist.location === locationFilter);
    }

    setFilteredArtists(results);
  }, [searchQuery, categoryFilter, genreFilter, locationFilter, artists]);

  // Artist card click
  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
  };

  // Handle booking action
  const handleBookClick = () => {
    setShowBookingForm(true);
  };

  // Close detail page
  const closeDetailPage = () => {
    setSelectedArtist(null);
  };

  // Close booking form and reset selected artist
  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedArtist(null);
  };

  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader onSearch={setSearchQuery} pageContext="Browse Artists" />

        <div className="client-browse-artist-container">
          <h2>Browse Music Artists</h2>

          {/* Filters */}
          <div className="client-browse-artist-filters">
            <select
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="">All Categories</option>
              <option value="Singer">Singer</option>
              <option value="Band">Band</option>
              <option value="DJ">DJ</option>
              <option value="Instrumentalist">Instrumentalist</option>
            </select>

            <select
              onChange={(e) => setGenreFilter(e.target.value)}
              value={genreFilter}
            >
              <option value="">All Genres</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Jazz">Jazz</option>
              <option value="Electronic">Electronic</option>
            </select>

            <select
              onChange={(e) => setLocationFilter(e.target.value)}
              value={locationFilter}
            >
              <option value="">All Locations</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>

          {/* Artist Cards */}
          <div className="client-browse-artist-grid">
            {filteredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={() => handleArtistClick(artist)}
              />
            ))}
          </div>

          {/* Artist Detail Modal */}
          {selectedArtist && (
            <ArtistDetailPage
              artist={selectedArtist}
              onClose={closeDetailPage}
              onBookClick={handleBookClick}
            />
          )}

          {/* Booking Form Modal */}
          {showBookingForm && selectedArtist && (
            <BookingForm
              artist={selectedArtist}
              clientInfo={clientInfo}
              onClose={closeBookingForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientBrowserArtist;
