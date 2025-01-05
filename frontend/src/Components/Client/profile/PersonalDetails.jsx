import React, { useState, useEffect } from "react";
import { useAuth } from "../../authContext"; // Use your authentication context
import { db } from "../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import "./PersonalDetails.css";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

function PersonalDetails() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({
    email: "", // This will be automatically set from the authenticated user
    phone: "",
    dateOfBirth: "",
    gender: "",
    preferredLanguage: "",
  });

  useEffect(() => {
    // Fetch personal details from Firestore
    const fetchPersonalDetails = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPersonalDetails({ email: currentUser.email, ...docSnap.data() });
        } else {
          // If no details exist, set the email from the authenticated user
          setPersonalDetails((prevDetails) => ({
            ...prevDetails,
            email: currentUser.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
        toast.error("Failed to fetch personal details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, [currentUser]);

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;

    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Start saving loader

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { ...personalDetails }, { merge: true }); // Store personal details in Firestore
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save personal details. Please try again.");
    } finally {
      setIsSaving(false); // End saving loader
    }
  };

  return (
    <div className="profile-section">
      <h2>Personal Details</h2>

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
        {/* Email (read-only) */}
        <div className="form-section">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={personalDetails.email}
            className="form-input"
            placeholder="Email"
            readOnly // Make the email field read-only
          />
        </div>

        <div className="form-section">
          <label>Phone</label>
          <input
            type="phone"
            name="phone"
            value={personalDetails.phone}
            onChange={handlePersonalDetailsChange}
            className="form-input"
            placeholder="Phone Number"
          />
        </div>

        <div className="form-section">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={personalDetails.dateOfBirth}
            onChange={handlePersonalDetailsChange}
            className="form-input"
          />
        </div>

        <div className="form-section">
          <label>Gender</label>
          <select
            name="gender"
            value={personalDetails.gender}
            onChange={handlePersonalDetailsChange}
            className="form-input"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonBinary">Non-Binary</option>
          </select>
        </div>

        <div className="form-section">
          <label>Preferred Language</label>
          <input
            type="text"
            name="preferredLanguage"
            value={personalDetails.preferredLanguage}
            onChange={handlePersonalDetailsChange}
            className="form-input"
            placeholder="e.g., English"
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

export default PersonalDetails;
