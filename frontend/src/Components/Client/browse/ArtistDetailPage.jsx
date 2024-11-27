import React, { useState, useEffect } from "react";
import "./ArtistDetailPage.css";

function ArtistDetailPage({ artist, onClose, onBookClick }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [sampleTracks, setSampleTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Close modal
  const closeModal = () => {
    onClose();
  };

  // Handle chat action
  const handleChatClick = () => {
    alert(`Starting chat with ${artist?.name}`);
  };

  // Handle video click
  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setLoading(true); // Start loading when video modal opens
  };

  // Handle track click
  const handleTrackClick = (trackUrl) => {
    setSelectedTrack(trackUrl);
  };

  // Close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Close track modal
  const closeTrackModal = () => {
    setSelectedTrack(null);
  };

  // Initialize mock sample tracks and store them in localStorage
  const initializeSampleTracks = () => {
    const mockTracks = [
      { name: "Harmony in Motion", url: "https://example.com/audio/track1.mp3" },
      { name: "Echoes of the Soul", url: "https://example.com/audio/track2.mp3" },
      { name: "Whispers of the Heart", url: "https://example.com/audio/track3.mp3" },
    ];

    const storedTracks = JSON.parse(localStorage.getItem("sampleTracks"));
    if (!storedTracks) {
      localStorage.setItem("sampleTracks", JSON.stringify(mockTracks));
      setSampleTracks(mockTracks);
    } else {
      setSampleTracks(storedTracks);
    }
  };

  // Fetch sample tracks from localStorage
  useEffect(() => {
    initializeSampleTracks();
  }, []);

  return (
    <div className="artist-modal-overlay">
      <div className="artist-modal">
        <button className="modal-close-btn" onClick={closeModal}>
          ✖
        </button>

        {/* Left Section: Artist Profile */}
        <div className="artist-modal-left">
          <img
            src={artist?.avatar}
            alt={artist?.name}
            className="artist-avatar-large"
          />
          <h2 className="artist-name">{artist?.name}</h2>
          <p className="artist-category">{artist?.category}</p>
          <p className="artist-genre">Genres: {artist?.genre}</p>
          {artist?.location && <p className="artist-location">Location: {artist.location}</p>}

          {/* Social Links */}
          <div className="social-links">
            <a href={artist?.social?.twitter || "#"}>🐦</a>
            <a href={artist?.social?.instagram || "#"}>📸</a>
            <a href={artist?.social?.facebook || "#"}>📘</a>
            <a href={artist?.social?.youtube || "#"}>🎥</a>
          </div>
        </div>

        {/* Right Section: Artist Details */}
        <div className="artist-modal-right">
          <div className="artist-detail-section">
            <h3>Biography</h3>
            <p>{artist?.bio}</p>

            <h3>Videos</h3>
            <div className="videos">
              {artist?.videos?.length > 0 ? (
                artist?.videos.map((video, index) => (
                  <img
                    key={index}
                    src={video.thumbnail}
                    alt={`Video ${index}`}
                    className="video-thumbnail"
                    onClick={() => handleVideoClick(video.url)}
                  />
                ))
              ) : (
                <p>No videos available</p>
              )}
            </div>

            <h3>Sample Tracks</h3>
            <ul className="sample-tracks">
              {sampleTracks.length > 0 ? (
                sampleTracks.map((track, index) => (
                  <li
                    key={index}
                    className="sample-track"
                    onClick={() => handleTrackClick(track.url)}
                  >
                    {track.name}
                  </li>
                ))
              ) : (
                <p>No sample tracks available</p>
              )}
            </ul>

            {/* Action Buttons */}
            <div className="modal-action-buttons">
              <button className="chat-btn" onClick={handleChatClick}>
                Chat Now
              </button>
              <button className="book-btn" onClick={onBookClick}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal">
            <button className="modal-close-btn" onClick={closeVideoModal}>
              ✖
            </button>
            {loading && <div className="loading-spinner">Loading video...</div>}
            <video
              controls
              autoPlay
              className="video-player"
              onLoadedData={() => setLoading(false)} // Stop loading when video is ready
              onError={() => {
                setLoading(false);
                alert("Error loading video.");
              }}
            >
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Track Modal */}
      {selectedTrack && (
        <div className="track-modal-overlay" onClick={closeTrackModal}>
          <div className="track-modal">
            <button className="modal-close-btn" onClick={closeTrackModal}>
              ✖
            </button>
            <audio controls className="audio-player">
              <source src={selectedTrack} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistDetailPage;
