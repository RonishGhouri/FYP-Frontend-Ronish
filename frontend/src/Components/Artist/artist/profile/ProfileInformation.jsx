import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../../../authContext"; // Use your authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./ProfileInformation.css";

function ProfileInformation() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    profilePicture: "",
    bio: "",
    isPublicProfile: true,
    location: "",
  });

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return; // Ensure the user is authenticated
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid); // Get the user's Firestore document from "userProfiles"
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData((prevData) => ({
            ...prevData,
            ...data, // Merge Firestore fields into the current state
          }));
        } else {
          console.log("No profile found!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const newProfilePic = fileReader.result;
      setProfileData({
        ...profileData,
        profilePicture: newProfilePic,
      });
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  const handleRemovePhoto = () => {
    setProfileData({ ...profileData, profilePicture: "" });
    setShowImageModal(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const docRef = doc(db, "users", currentUser.uid); // Save to "userProfiles"
      await setDoc(docRef, { ...profileData }, { merge: true });
      setSuccess(true);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Profile Information</h2>
      {loading && <p>Loading...</p>}
      {success && <p className="success-message">Profile updated successfully!</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSaveChanges}>
        {/* Profile Picture */}
        <div className="profile-picture-wrapper">
          <div className="profile-picture-section">
            <img
              src={profileData.profilePicture || "default-avatar.png"}
              alt="Profile"
              className="profile-picture"
              onClick={() => setShowImageModal(true)}
            />
            <FaPencilAlt
              className="edit-icon"
              onClick={() => setShowImageModal(true)}
            />
          </div>

          {/* Modal for Upload/Remove options */}
          {showImageModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Change Profile Photo</h3>
                <button
                  className="modal-upload-button"
                  onClick={() => {
                    document.getElementById("profilePicture").click();
                    setShowImageModal(false);
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
                  onClick={() => setShowImageModal(false)}
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
            style={{ display: "none" }}
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
          />
        </div>

        {/* Profile Visibility */}
        <div className="form-section">
          <label>Profile Visibility</label>
          <input
            type="checkbox"
            name="isPublicProfile"
            checked={profileData.isPublicProfile}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                isPublicProfile: e.target.checked,
              })
            }
          /> Public Profile
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
          />
        </div>

        {/* Save Button */}
        <div className="form-section">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileInformation;
