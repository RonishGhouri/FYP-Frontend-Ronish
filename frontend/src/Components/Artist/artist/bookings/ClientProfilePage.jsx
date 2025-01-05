import React from "react";
import "./ClientProfilePage.css";

const ClientProfilePage = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="client-profile-modal-overlay">
      <div className="client-profile-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="client-profile-modal-content">
          <img
            src={client.profilePicture || "default-avatar.png"}
            alt={client.name || "Client"}
            className="client-avatar-large"
          />
          <h2 className="client-name">{client.name || "No Name Available"}</h2>
          <p>
            <strong>Location:</strong> {client.location || "N/A"}
          </p>
          {client.phone && (
            <p>
              <strong>Phone:</strong> {client.phone || "N/A"}
            </p>
          )}
          <p>
            <strong>Bio:</strong> {client.bio || "N/A"}
          </p>
          <p>
            <strong>Preferred Language:</strong>{" "}
            {client.preferredLanguage || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
