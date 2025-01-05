import React from "react";
import "./ArtistCard.css";

function ArtistCard({ artist, onClick }) {
  // Safely format genre and skills arrays
  const formatArray = (array) =>
    array?.length > 0
      ? array.map((item) => item.label || item.value || item).join(", ")
      : "N/A";

  return (
    <div className="artist-cardd" onClick={onClick}>
      {/* Artist Avatar */}
      <img
        src={artist.profilePicture || "default-avatar.png"} // Safeguard for missing image
        alt={artist.name || "Artist"}
        className="artist-avatar"
      />

      {/* Artist Name and Category */}
      <h3 className="artists-name">{artist.name || "Name not available"}</h3>
      <p className="artist-category">
        {artist.category?.toUpperCase() || "Category N/A"}
      </p>

      {/* Artist Genre */}
      <p className="artist-genre">
        <strong>Genres:</strong> {formatArray(artist.genre)}
      </p>

      {/* Artist Skills */}
      <p className="artist-skills">
        <strong>Skills:</strong> {formatArray(artist.skills)}
      </p>

      {/* Artist Rating */}
      <div className="artist-rating">
        <span>
          Rating:{" "}
          <span role="img" aria-label="star">
            ⭐
          </span>{" "}
          {artist.rating !== "N/A" && artist.rating !== undefined
            ? artist.rating
            : "N/A"}
        </span>
        /5
      </div>

      {/* Starting Price */}
      <h3 className="artist-price">
        Starting from:{" "}
        <span>Rs. {artist.chargesperevent || "Not available"}</span>
      </h3>
    </div>
  );
}

export default ArtistCard;
