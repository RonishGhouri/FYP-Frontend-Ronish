import React from "react";
import "./PrivacySettings.css";

const PrivacySettings = () => {
  return (
    <div className="profile-section">
      <h2>Privacy Settings</h2>
      <form>
        <div className="form-section">
          <label>Who Can See My Profile</label>
          <select className="form-input">
            <option value="public">Public</option>
            <option value="followers">Only Followers</option>
            <option value="clients">Only Clients</option>
          </select>
        </div>

        <div className="form-section">
          <label>Who Can Send Me Messages</label>
          <select className="form-input">
            <option value="everyone">Everyone</option>
            <option value="followers">Only Followers</option>
            <option value="clients">Only Clients</option>
          </select>
        </div>

        <div className="form-section">
          <label>Who Can See My Posts</label>
          <select className="form-input">
            <option value="public">Public</option>
            <option value="followers">Only Followers</option>
            <option value="clients">Only Clients</option>
          </select>
        </div>
        {/* Save Button */}
        <div className="form-section">
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivacySettings;
