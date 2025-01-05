import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Sidebar from "../sidebar/ClientSidebar";
import Header from "../header/ClientHeader";
import { ThreeDot } from "react-loading-indicators";
import "./ProfilePage.css";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [content, setContent] = useState({ all: [], images: [], videos: [] });
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState(null);

  const location = useLocation();
  const artist = location.state?.artist || {};

  // Real-time listener for artist data
  useEffect(() => {
    if (!artist.id) {
      setError("Artist ID is missing.");
      return;
    }

    const unsubscribeUser = onSnapshot(
      doc(db, "users", artist.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setArtistData((prevData) => ({
            ...prevData,
            ...docSnapshot.data(),
          }));
        } else {
          setError("Artist data not found.");
        }
      },
      (err) => {
        console.error("Error fetching artist data:", err);
        setError("Failed to fetch artist data.");
      }
    );

    const unsubscribePortfolio = onSnapshot(
      doc(db, "portfolios", artist.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setArtistData((prevData) => ({
            ...prevData,
            social: {
              facebook: docSnapshot.data().facebookLink || null,
              instagram: docSnapshot.data().instagramLink || null,
              youtube: docSnapshot.data().youtubeLink || null,
            },
          }));
        }
      },
      (err) => {
        console.error("Error fetching portfolio data:", err);
      }
    );

    const unsubscribeRating = onSnapshot(
      doc(db, "ratings", artist.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const ratingData = docSnapshot.data();
          console.log("Fetched rating data:", ratingData); // Check if `overallRating` is fetched
          setArtistData((prevData) => ({
            ...prevData,
            rating: ratingData.overallRating
          }));
          
        } else {
          console.warn("No rating document found for artist ID:", artist.id);
          setArtistData((prevData) => ({
            ...prevData,
            rating: "N/A",
          }));
        }
      },
      (err) => {
        console.error("Error fetching rating data:", err);
        setArtistData((prevData) => ({
          ...prevData,
          rating: "N/A",
        }));
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribePortfolio();
      unsubscribeRating();
    };
  }, [artist.id]);

  // Fetch artist content in real-time
  useEffect(() => {
    if (!artist.id) {
      setError("Artist ID is missing.");
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "artistContent"),
      where("artistId", "==", artist.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedContent = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const images = fetchedContent.filter((item) => item.type === "image");
        const videos = fetchedContent.filter((item) => item.type === "video");

        setContent({
          all: fetchedContent,
          images,
          videos,
        });

        setLoading(false);
      },
      (err) => {
        console.error("Error fetching artist content:", err);
        setError("Failed to load artist content.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [artist.id]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "videos", label: "Videos" },
    { id: "images", label: "Images" },
  ];

  const handleMediaClick = (media) => setSelectedMedia(media);

  const closeMediaModal = () => setSelectedMedia(null);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-dashboard">
        <Header pageContext="Profile Page" />
        <div className="profileView-section">
          {artistData ? (
            <>
              {/* Profile Header */}
              <div className="profile-header">
                <div className="profile-avatar">
                  <img
                    src={
                      artistData.profilePicture ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                  />
                </div>
                <div className="profile-details">
                  <h1>{artistData.name || "N/A"}</h1>
                  <span className="bio">
                    {artistData.bio || "No bio available"}
                  </span>
                  &nbsp;&nbsp;&nbsp;
                  {artistData.phone && (
                    <span>
                      <strong>Phone:</strong> {artistData.phone}
                    </span>
                  )}
                  <div className="stat-counters">
                    <div className="stat">
                      <span className="stat-value">{content.all.length}</span>
                      <span className="stat-label">Posts</span>
                    </div>
                  </div>
                  <div className="artists-rating">
                    <span>
                      Rating:{" "}
                      <span role="img" aria-label="star">
                        ⭐
                      </span>{" "}
                      {artistData?.rating !== null &&
                      artistData?.rating !== undefined
                        ? artistData.rating
                        : "N/A"}
                      /5
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="socials-links">
                {artistData.social?.instagram && (
                  <a
                    href={artistData.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://gallerypngs.com/wp-content/uploads/2024/07/instagram-logo-png-image.png"
                      alt="Instagram"
                      className="socials-logo"
                    />
                  </a>
                )}
                {artistData.social?.facebook && (
                  <a
                    href={artistData.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
                      alt="Facebook"
                      className="socials-logo"
                    />
                  </a>
                )}
                {artistData.social?.youtube && (
                  <a
                    href={artistData.social.youtube}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png"
                      alt="YouTube"
                      className="socials-logo"
                    />
                  </a>
                )}
              </div>

              {/* Profile Tabs */}
              <div className="tabs-section">
                <div className="tab-buttons">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`tab-button ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="content-grid">
                  {loading ? (
                    <div className="loader">
                      <ThreeDot color="#212ea0" size="small" />
                    </div>
                  ) : error ? (
                    <p className="error-message">{error}</p>
                  ) : content[activeTab].length > 0 ? (
                    content[activeTab].map((item, index) => (
                      <div
                        key={index}
                        className="grid-item"
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
                    <p>No content available.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="error-message">Loading artist data...</p>
          )}
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
    </div>
  );
}

export default ProfilePage;
