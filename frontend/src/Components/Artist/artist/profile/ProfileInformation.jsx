import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../../../authContext"; // Use your authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import Select from "react-select"; // Importing react-select
import "./ProfileInformation.css";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

const customStyles = {
  control: (base) => ({
    ...base,
    width: 543, // Width of the dropdown
    padding: 4,
    border: "1px solid #ddd", // Add border
    borderRadius: "9px", // Rounded corners
    boxShadow: "none", // Remove default shadow
    "&:hover": {
      borderColor: "#0056b3", // Border color on hover
    },
  }),
  menu: (base) => ({
    ...base,
    border: "1px solid #ddd", // Add border
    borderRadius: "9px", // Rounded corners
    width: 543, // Match dropdown width
    maxHeight: "200px", // Restrict the height of the dropdown
    overflow: "visible", // Prevent clipping of scroll bar
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Dropdown shadow
  }),
  menuList: (base) => ({
    ...base,
    border: "1px solid #ddd", // Add border
    borderRadius: "9px", // Rounded corners
    maxHeight: "100px", // Restrict the height of options
    overflowY: "scroll", // Enable vertical scrolling
    scrollbarWidth: "thin", // For Firefox
    "&::-webkit-scrollbar": {
      width: "10px",
      borderRadius: "10px", // Rounded scrollbar
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#212ea0" : "#fff", // Highlight selected option
    color: state.isSelected ? "#fff" : "#000", // Text color
    "&:hover": {
      background: "linear-gradient(135deg, #2980b9, #8e44ad)",
      color: "white",
    },
    padding: 10, // Spacing for options
  }),
};

function ProfileInformation() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [locations, setLocations] = useState([]); // Store fetched locations
  const [showOtherField, setShowOtherField] = useState(false); // Show other location field

  const [profileData, setProfileData] = useState({
    name: "",
    profilePicture: "",
    bio: "",
    location: "",
  });

  useEffect(() => {
    // Fetch profile data from Firestore
    const fetchProfile = async () => {
      if (!currentUser) return; // Ensure the user is authenticated
      setLoading(true);
      setLoadings(true);

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
      } finally {
        setLoading(false);
        setLoadings(false);
      }
    };

    // Fetch available locations from Firestore
    const fetchLocations = async () => {
      try {
        const locationsDoc = doc(db, "locations", "DvX5hWPcQvMfMLWn1Zw7"); // Adjust with your actual document ID
        const docSnap = await getDoc(locationsDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLocations(data.location || []);
        } else {
          console.log("No locations found!");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchProfile();
    fetchLocations();
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
    setLoadings(true);

    try {
      const docRef = doc(db, "users", currentUser.uid); // Reference to the user's document in Firestore

      // Check if "other" field is selected and process the location
      if (showOtherField && profileData.location) {
        // Capitalize the first letter of the entered location
        const capitalizedLocation =
          profileData.location.charAt(0).toUpperCase() +
          profileData.location.slice(1).toLowerCase();

        console.log("Capitalized Location:", capitalizedLocation);

        // Reference to the locations collection/document
        const locationsDoc = doc(db, "locations", "DvX5hWPcQvMfMLWn1Zw7"); // Replace with your actual document ID
        const docSnap = await getDoc(locationsDoc);

        if (docSnap.exists()) {
          const existingLocations = docSnap.data().location || [];
          console.log("Existing Locations:", existingLocations);

          // Add the new location only if it doesn't already exist
          if (!existingLocations.includes(capitalizedLocation)) {
            await updateDoc(locationsDoc, {
              location: [...existingLocations, capitalizedLocation],
            });
            console.log(
              "New location added to Firestore locations:",
              capitalizedLocation
            );
            setLocations((prev) => [...prev, capitalizedLocation]);
          }
        } else {
          // If the locations document doesn't exist, create it with the new location
          await setDoc(locationsDoc, { location: [capitalizedLocation] });
          console.log(
            "Locations document created with location:",
            capitalizedLocation
          );
          setLocations((prev) => [...prev, capitalizedLocation]);
        }

        // Save the capitalized location to profileData for consistency
        profileData.location = capitalizedLocation;
      }

      // Save the updated profile data, including the capitalized location, to the user's document
      await setDoc(docRef, { ...profileData }, { merge: true });
      console.log("Profile updated with location:", profileData.location);

      // Reset the "Other" field visibility after saving
      if (showOtherField) {
        setShowOtherField(false);
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
      setLoadings(false);
    }
  };

  const handleLocationChange = (selectedOption) => {
    if (selectedOption.value === "other") {
      setShowOtherField(true);
      setProfileData({ ...profileData, location: "" });
    } else {
      setShowOtherField(false);
      setProfileData({ ...profileData, location: selectedOption.value });
    }
  };

  // Preparing data for react-select
  const locationOptions = locations.map((location) => ({
    value: location,
    label: location,
  }));
  locationOptions.push({ value: "other", label: "Other" });

  return (
    <div className="profile-section">
      <h2>Profile Information</h2>
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
          <label>Artist Bio</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            className="form-input"
            rows="4"
          />
        </div>

        {/* Location with react-select */}
        <div className="form-section">
          <label>Location</label>
          <Select
            options={locationOptions}
            value={locationOptions.find(
              (option) => option.value === profileData.location
            )}
            onChange={handleLocationChange}
            styles={customStyles}
            menuPlacement="top" // Ensures the menu appears as a drop-up
            className="react-select"
            placeholder="Select your city..."
            noOptionsMessage={() => (
              <div
                style={{
                  padding: "8px", // Match the padding of react-select options
                }}
              >
                <span>Not found, click "Other"</span>
                <br />
                <div
                  style={{
                    display: "flex",
                    padding: "10px 220px", // Match option padding
                    margin: "0 -3.5%",
                    backgroundColor: "#fff", // Default background
                    color: "#333", // Default text color
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg, #2980b9, #8e44ad)"; // Correct background gradient
                    e.target.style.color = "white"; // Correct text color
                  }} // Match hover background color
                  onMouseOut={(e) => {
                    e.target.style.background = "#fff"; // Reset background color
                    e.target.style.color = "#333"; // Reset text color
                  }}
                  onClick={() => {
                    setShowOtherField(true);
                    setProfileData({ ...profileData, location: "other" });
                  }}
                >
                  Other
                </div>
              </div>
            )}
          />
          {showOtherField && (
            <>
              <br />
              <input
                type="text"
                name="location"
                placeholder="Please specify your location"
                value={
                  profileData.location === "other" ? "" : profileData.location
                }
                onChange={handleInputChange}
                className="form-input"
              />
            </>
          )}
        </div>
        <div className="form-section">
          <button type="submit" className="save-button" disabled={loadings}>
            {loadings ? "Saving..." : "Save Changes"}
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
