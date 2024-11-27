import React from "react";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import "./ProfileInformation.css";

function ProfileInformation() {
  const [showImageModal, setShowImageModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    profilePicture: "",
    bio: "",
    isPublicProfile: true,
    location: "",
  });

  useEffect(() => {
    // Retrieve profile information from localStorage
    const storedProfilePic = localStorage.getItem("profilePicture");
    const storedUsername = localStorage.getItem("username");
    const storedName = localStorage.getItem("name");
    const storedBio = localStorage.getItem("bio");
    const storedLocation = localStorage.getItem("location");

    setProfileData((prevData) => ({
      ...prevData,
      profilePicture: storedProfilePic || prevData.profilePicture,
      username: storedUsername || prevData.username,
      name: storedName || prevData.name,
      bio: storedBio || prevData.bio,
      location: storedLocation || prevData.location,
    }));
  }, []);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const newProfilePic = fileReader.result;

      // Update the profile picture in the state and localStorage
      setProfileData({
        ...profileData,
        profilePicture: newProfilePic,
      });
      localStorage.setItem("profilePicture", newProfilePic); // Store profile pic in localStorage for the header and profile info section
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  // Function to remove the current profile picture
  const handleRemovePhoto = () => {
    setProfileData({ ...profileData, profilePicture: "default-avatar.png" });
    localStorage.setItem("profilePicture", "default-avatar.png"); // Store default image in localStorage
    setShowImageModal(false); // Close modal after removing
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Store profile information in localStorage
    localStorage.setItem("name", profileData.name);
    localStorage.setItem("username", profileData.username);
    localStorage.setItem("bio", profileData.bio);
    localStorage.setItem("location", profileData.location);
    localStorage.setItem("profilePicture", profileData.profilePicture);
  };
  return (
    <div className="profile-section">
      <h2>Profile Information</h2>
      <form onSubmit={handleSaveChanges}>
        {/* Profile Picture */}
        <div className="profile-picture-wrapper">
          <div className="profile-picture-section">
            <img
              src={profileData.profilePicture || "default-avatar.png"}
              alt="Profile"
              className="profile-picture"
              onClick={() => setShowImageModal(true)} // Open modal on image click
            />
            <FaPencilAlt
              className="edit-icon"
              onClick={() => setShowImageModal(true)}
            />{" "}
            {/* Pencil Icon for edit indication */}
          </div>

          {/* Modal for Upload/Remove options */}
          {showImageModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Change Profile Photo</h3>
                <button
                  className="modal-upload-button"
                  onClick={() => {
                    document.getElementById("profilePicture").click(); // Trigger file input
                    setShowImageModal(false); // Close modal after clicking upload
                  }}
                >
                  Upload New Photo
                </button>
                <br />
                <button
                  className="modal-remove-button"
                  onClick={handleRemovePhoto}
                >
                  Remove Current Photo
                </button>
                <br />
                <button
                  className="modal-cancel-button"
                  onClick={() => setShowImageModal(false)} // Close modal on cancel
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange}
            className="file-input"
            accept="image/*"
            style={{ display: "none" }} // Hide the file input
          />
        </div>
        {/* Name and Username */}
        <div className="form-section">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-section">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        {/* Bio */}
        <div className="form-section">
          <label>Bio</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            className="form-input"
            rows="4"
            placeholder="A short description or bio about yourself."
          />
        </div>

        {/* Profile Visibility */}
        <div className="form-section">
          <label>Profile Visibility</label>
          <input
            type="checkbox"
            name="isPublicProfile"
            checked={profileData.isPublicProfile}
            onChange={handleInputChange}
          />{" "}
          Public Profile
        </div>

        {/* Location */}
        <div className="form-section">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={profileData.location}
            onChange={handleInputChange}
            className="form-input"
            placeholder="City or Country"
          />
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
}

export default ProfileInformation;
