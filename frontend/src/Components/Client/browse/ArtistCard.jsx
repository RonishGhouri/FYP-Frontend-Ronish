// ArtistCard.js
import React from "react";
import "./ArtistCard.css";

function ArtistCard({ artist, onClick }) {
  return (
    <div className="artist-cardd" onClick={onClick}>
      {/* Artist Avatar */}
      <img
        src={artist.avatar}
        alt={artist.name}
        className="artist-avatar"
      />

      {/* Artist Name and Category */}
      <h3 className="artist-name">{artist.name}</h3>
      <p className="artist-genre">{artist.genre}</p>

      {/* Artist Rating */}
      <div className="artist-rating">
        <span>Rating: ⭐ {artist.rating}</span>
      </div>
    </div>
  );
}

export default ArtistCard;
