import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistDetailPage.css";
import BookingForm from "./BookingForm";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  setDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import { getAuth } from "firebase/auth";

function ArtistDetailPage({ artist, onClose }) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [mediaContent, setMediaContent] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null); // For media preview
  const [loading, setLoading] = useState(false); // Loader for fetching media

  const navigate = useNavigate();
  const auth = getAuth(); // Firebase Authentication

  const handleChatNowClick = async () => {
    const clientId = auth.currentUser?.uid;
    const chatId = `${clientId}_${artist.id}`;
    const chatDoc = doc(db, "chats", chatId);

    try {
      // Fetch client details from Firestore
      const clientRef = doc(db, "users", clientId);
      const clientSnapshot = await getDoc(clientRef);

      const clientData = clientSnapshot.exists()
        ? clientSnapshot.data()
        : {
            name: auth.currentUser?.displayName || "Client", // Fallback to Firebase Auth's displayName or "Client"
            profilePicture: "default-client-avatar.png", // Fallback to default avatar
          };

      // Fetch artist details from Firestore
      const artistRef = doc(db, "users", artist.id);
      const artistSnapshot = await getDoc(artistRef);

      const artistData = artistSnapshot.exists()
        ? artistSnapshot.data()
        : {
            name: artist.name || "Artist", // Use artist name or fallback
            avatar: "default-artist-avatar.png", // Default avatar
          };

      const chatSnapshot = await getDoc(chatDoc);

      if (!chatSnapshot.exists()) {
        const newChatData = {
          id: chatId,
          client: {
            id: clientId,
            name: clientData.name || "Unknown Client", // Ensure valid name
            avatar: clientData.profilePicture || "default-client-avatar.png", // Ensure valid avatar
          },
          artist: {
            id: artist.id,
            name: artistData.name || "Unknown Artist", // Ensure valid name
            avatar: artistData.profilePicture || "default-artist-avatar.png", // Ensure valid avatar
          },
          clientMessages: [],
          artistMessages: [],
          createdAt: new Date().toISOString(),
          deletedByClient: false,
          deletedByArtist: false,
          clientOnline: true,
          artistOnline: true,
          artistTyping: false,
          clientTyping: false,
        };

        await setDoc(chatDoc, newChatData);
      }

      navigate("/client/chats", {
        state: {
          artist: {
            id: artist.id,
            name: artistData.name,
            avatar: artistData.profilePicture,
          },
        },
      });
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };
  // Fetch media content for the artist
  useEffect(() => {
    const fetchMedia = async () => {
      if (!artist?.id) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, "artistContent"),
          where("artistId", "==", artist.id),
          // orderBy("timestamp", "desc"), // Order by timestamp in descending order
          limit(2) // Fetch only the last 2 uploads
        );
        const querySnapshot = await getDocs(q);
        const fetchedMedia = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMediaContent(fetchedMedia);
      } catch (error) {
        console.error("Error fetching artist media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [artist.id]);

  // Helper function to format arrays
  const formatArray = (array) =>
    array?.length > 0
      ? array.map((item) => item.label || item.value || item).join(", ")
      : "N/A";

  // Handle Book Now Button Click
  const handleBookNowClick = (bookingId = null) => {
    setEditingBookingId(bookingId);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setEditingBookingId(null);
    setShowBookingForm(false);
  };

  // Handle media click for preview
  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="artist-modal-overlay">
      <div className="artist-modal">
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Left Section: Artist Profile */}
        <div className="artist-modal-left">
          <img
            src={artist?.profilePicture || "default-avatar.png"}
            alt={artist?.name || "Artist"}
            className="artist-avatar-large"
          />
          <h2 className="artists-name">
            {artist?.name || "No Name Available"}
          </h2>
          <p className="artist-category">
            <strong>Category:</strong> {artist?.category || "N/A"}
          </p>
          <p className="artist-genre">
            <strong>Genres:</strong> {formatArray(artist?.genre)}
          </p>
          <p className="artist-skills">
            <strong>Skills:</strong> {formatArray(artist?.skills)}
          </p>
          {artist?.location && (
            <p className="artist-location">
              <strong>Location:</strong> {artist.location}
            </p>
          )}

          {/* Social Links */}
          <div className="social-links">
            {artist?.social?.instagram && (
              <a
                href={artist.social.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://gallerypngs.com/wp-content/uploads/2024/07/instagram-logo-png-image.png"
                  alt="Instagram"
                  className="social-logo"
                />
              </a>
            )}
            {artist?.social?.facebook && (
              <a href={artist.social.facebook} target="_blank" rel="noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
                  alt="Facebook"
                  className="social-logo"
                />
              </a>
            )}
            {artist?.social?.youtube && (
              <a href={artist.social.youtube} target="_blank" rel="noreferrer">
                <img
                  src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png"
                  alt="YouTube"
                  className="youtube-logo"
                />
              </a>
            )}
          </div>

          <button
            className="view-profile-btn"
            onClick={() => navigate("/profile", { state: { artist } })}
          >
            View Profile
          </button>
        </div>

        {/* Right Section: Media Content */}
        <div className="artist-modal-right">
          <div className="artist-detail-section">
            <h3>Biography</h3>
            <p>{artist?.bio || "No biography available."}</p>

            <h3>Recent Photos or Videos</h3>
            <div className="artist-media-grid">
              {loading ? (
                <div style={styles.overlay}>
                  <div style={styles.loaderContainer}>
                    <ThreeDot
                      color="#212ea0" // Loader color
                      size="small" // Loader size
                    />
                  </div>
                </div>
              ) : mediaContent.length > 0 ? (
                mediaContent.map((item, index) => (
                  <div
                    key={index}
                    className="media-item"
                    onClick={() => handleMediaClick(item)}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.fileUrl}
                        className="artist-media-preview"
                        muted
                      />
                    ) : (
                      <img
                        src={item.fileUrl}
                        alt={`Media ${index}`}
                        className="artist-media-preview"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No media available.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-action-buttons">
              <button className="chat-btn" onClick={handleChatNowClick}>
                Chat Now
              </button>
              <button className="book-btn" onClick={() => handleBookNowClick()}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="media-preview-modal" onClick={closeMediaModal}>
          <div className="media-preview-content">
            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.fileUrl}
                controls
                autoPlay
                className="media-preview"
              />
            ) : (
              <img
                src={selectedMedia.fileUrl}
                alt="Media Preview"
                className="media-preview"
              />
            )}
            <button className="close-preview-btn" onClick={closeMediaModal}>
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          artist={artist}
          bookingId={editingBookingId}
          onClose={closeBookingForm}
        />
      )}
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
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Grey transparent background
    zIndex: 9999, // Ensure the loader appears above everything else
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
    borderRadius: "8px", // Rounded corners for the popup
  },
};
export default ArtistDetailPage;
