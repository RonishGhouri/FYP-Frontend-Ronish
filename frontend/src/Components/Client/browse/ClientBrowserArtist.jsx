import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  getDoc,
  collection,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Firestore configuration
import ClientSidebar from "../sidebar/ClientSidebar";
import ClientHeader from "../header/ClientHeader";
import "./ClientBrowserArtist.css";
import ArtistCard from "./ArtistCard";
import ArtistDetailPage from "./ArtistDetailPage";
import BookingForm from "./BookingForm";
import { ThreeDot } from "react-loading-indicators"; // Import the loader

function ClientBrowserArtist() {
  const [artists, setArtists] = useState([]); // Artists fetched from Firestore
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [skills, setSkills] = useState([]);
  const [genres, setGenres] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  // Real-time listener for artists
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "artist"),
      where("availability", "==", true)
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        try {
          setLoading(true);
          const artistData = await Promise.all(
            querySnapshot.docs.map(async (docRef) => {
              const artist = { id: docRef.id, ...docRef.data() };

              // Fetch Ratings
              const ratingsDocRef = doc(db, "ratings", docRef.id);
              const ratingsDoc = await getDoc(ratingsDocRef);
              artist.rating =
                ratingsDoc.exists() &&
                ratingsDoc.data().overallRating !== undefined
                  ? ratingsDoc.data().overallRating
                  : "N/A";

              artist.chargesPerEvent =
                artist.chargesPerEvent || "Not available";

              // Fetch Social Links
              const portfolioDocRef = doc(db, "portfolios", docRef.id);
              const portfolioDoc = await getDoc(portfolioDocRef);
              artist.social = portfolioDoc.exists()
                ? {
                    instagram: portfolioDoc.data().instagramLink || null,
                    facebook: portfolioDoc.data().facebookLink || null,
                    youtube: portfolioDoc.data().youtubeLink || null,
                  }
                : {};

              // Normalize Genre and Skills to always be arrays
              artist.genre = Array.isArray(artist.genre) ? artist.genre : [];
              artist.skills = Array.isArray(artist.skills)
                ? artist.skills
                : [];

              return artist;
            })
          );

          setArtists(artistData);
          setFilteredArtists(artistData);
        } catch (error) {
          console.error("Error fetching artists:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to changes:", error);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
  // Fetch Skills, Genres, and Locations
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [skillsSnap, genresSnap, locationsSnap] = await Promise.all([
          getDoc(doc(db, "skill", "dlzobO1Fkei3FCNPGG3f")),
          getDoc(doc(db, "genre", "YkqOHp57YnOcswTNzEM9")),
          getDoc(doc(db, "locations", "DvX5hWPcQvMfMLWn1Zw7")),
        ]);

        if (skillsSnap.exists()) {
          setSkills(
            skillsSnap
              .data()
              .skillList.map((skill) => ({ label: skill, value: skill }))
          );
        }

        if (genresSnap.exists()) {
          setGenres(
            genresSnap
              .data()
              .genrelist.map((genre) => ({ label: genre, value: genre }))
          );
        }

        if (locationsSnap.exists()) {
          setLocations(
            locationsSnap.data().location.map((location) => ({
              label: location,
              value: location,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilters();
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = artists;

    // Search Query Filter
    if (searchQuery) {
      results = results.filter((artist) =>
        artist.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category Filter
    if (categoryFilter) {
      results = results.filter(
        (artist) =>
          artist.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Genre Filter (handles array of objects)
    if (genreFilter) {
      results = results.filter(
        (artist) =>
          Array.isArray(artist.genre) &&
          artist.genre.some((g) => g.value === genreFilter)
      );
    }

    // Location Filter
    if (locationFilter) {
      results = results.filter(
        (artist) =>
          artist.location?.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    // Skill Filter (handles array of objects)
    if (skillFilter) {
      results = results.filter(
        (artist) =>
          Array.isArray(artist.skills) &&
          artist.skills.some((s) => s.value === skillFilter)
      );
    }

    setFilteredArtists(results);
  }, [
    searchQuery,
    categoryFilter,
    genreFilter,
    locationFilter,
    skillFilter,
    artists,
  ]);

  // Artist card click
  const handleArtistClick = (artist) => {
    console.log("Selected Artist Data:", artist);
    console.log("Media Content:", artist.media);
    setSelectedArtist(artist);
  };

  const handleBookClick = () => {
    setShowBookingForm(true);
  };

  const closeDetailPage = () => {
    setSelectedArtist(null);
  };

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
          {/* Loader */}
          {loading && (
            <div style={styles.overlay}>
              <div style={styles.loaderContainer}>
                <ThreeDot color="#212ea0" size="small" />
              </div>
            </div>
          )}

          <div className="client-browse-artist-filters">
            {/* Category Filter */}
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

            {/* Conditional Filters */}
            {categoryFilter !== "DJ" && (
              <>
                <select
                  onChange={(e) => setGenreFilter(e.target.value)}
                  value={genreFilter}
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>

                <select
                  onChange={(e) => setLocationFilter(e.target.value)}
                  value={locationFilter}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>

                <select
                  onChange={(e) => setSkillFilter(e.target.value)}
                  value={skillFilter}
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill.value} value={skill.value}>
                      {skill.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="client-browse-artist-grid">
            {filteredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={() => handleArtistClick(artist)}
              />
            ))}
          </div>

          {selectedArtist && (
            <ArtistDetailPage
              artist={selectedArtist}
              onClose={closeDetailPage}
              onBookClick={handleBookClick}
            />
          )}

          {showBookingForm && selectedArtist && (
            <BookingForm artist={selectedArtist} onClose={closeBookingForm} />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    padding: "20px 40px",
    borderRadius: "8px",
  },
};
export default ClientBrowserArtist;
