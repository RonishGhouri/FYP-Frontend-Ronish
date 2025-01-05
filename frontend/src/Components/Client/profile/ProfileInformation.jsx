import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../../authContext"; // Use your authentication context
import { db } from "../../firebaseConfig"; // Firestore configuration
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import "./ProfileInformation.css";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

function ProfileInformation() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    profilePicture: "",
    bio: "",
    location: "",
  });

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return; // Ensure the user is authenticated
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid); // Get the user's Firestore document
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
      } finally {
        setLoading(false); // Stop loader for fetching
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
    setIsSaving(true); // Start saving loader

    try {
      const docRef = doc(db, "users", currentUser.uid); // Save to "userProfiles"
      await setDoc(docRef, { ...profileData }, { merge: true });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false); // Stop saving loader
    }
  };

  return (
    <div className="profile-section">
      <h2>Profile Information</h2>

      {/* Fetching Loader */}
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loaderContainer}>
            <ThreeDot
              color="#212ea0" // Loader color
              size="small" // Loader size
            />
          </div>
        </div>
      )}

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

        {/* Name */}
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

        {/* Location */}
        <div className="form-section">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={profileData.location}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 25-B, Gulberg III, Lahore"
          />
        </div>

        {/* Save Button */}
        <div className="form-section">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
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

export default ProfileInformation;
