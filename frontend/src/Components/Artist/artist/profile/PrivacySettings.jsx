import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./PrivacySettings.css";

const PrivacySettings = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "Everyone",
    messagePermissions: "Everyone",
    contentVisibility: "Everyone",
  });

  useEffect(() => {
    // Fetch privacy settings from Firestore
    const fetchPrivacySettings = async () => {
      if (!currentUser) {
        console.error("No authenticated user found.");
        return;
      }
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPrivacySettings({
            profileVisibility: data.profileVisibility || "Everyone",
            messagePermissions: data.messagePermissions || "Everyone",
            contentVisibility: data.contentVisibility || "Everyone",
          });
        } else {
          console.log("No privacy settings found. Using default values.");
        }
      } catch (error) {
        console.error("Error fetching privacy settings:", error);
        setError("Failed to fetch privacy settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacySettings();
  }, [currentUser]);

  const handlePrivacySettingsChange = (e) => {
    const { name, value } = e.target;
    setPrivacySettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.error("No authenticated user found.");
      setError("User not authenticated. Please log in again.");
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(
        docRef,
        {
          profileVisibility: privacySettings.profileVisibility,
          messagePermissions: privacySettings.messagePermissions,
          contentVisibility: privacySettings.contentVisibility,
        },
        { merge: true } // Merge data into existing document
      );
      console.log("Privacy settings successfully saved to Firestore.");
      setSuccess(true);
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      setError("Failed to save privacy settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Privacy Settings</h2>
      {loading && <p>Loading...</p>}
      {success && <p className="success-message">Privacy settings updated successfully!</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Who Can See My Profile</label>
          <select
            name="profileVisibility"
            value={privacySettings.profileVisibility}
            onChange={handlePrivacySettingsChange}
            className="form-input"
          >
            <option value="Everyone">Everyone</option>
            <option value="clients">Only Clients</option>
          </select>
        </div>

        <div className="form-section">
          <label>Who Can Send Me Messages</label>
          <select
            name="messagePermissions"
            value={privacySettings.messagePermissions}
            onChange={handlePrivacySettingsChange}
            className="form-input"
          >
            <option value="Everyone">Everyone</option>
            <option value="clients">Only Clients</option>
          </select>
        </div>

        <div className="form-section">
          <label>Who Can See My Content</label>
          <select
            name="contentVisibility"
            value={privacySettings.contentVisibility}
            onChange={handlePrivacySettingsChange}
            className="form-input"
          >
            <option value="Everyone">Everyone</option>
            <option value="clients">Only Clients</option>
          </select>
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
};

export default PrivacySettings;
