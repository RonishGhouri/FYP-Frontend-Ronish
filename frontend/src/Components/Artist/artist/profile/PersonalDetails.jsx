import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Use your authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./PersonalDetails.css";

function PersonalDetails() {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [personalDetails, setPersonalDetails] = useState({
    email: "", // This will be automatically set from the authenticated user
    phone: "",
    dateOfBirth: "",
    gender: "",
    skills: "",
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
        setError("Failed to fetch personal details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, [currentUser]);

  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({
      ...personalDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { ...personalDetails }, { merge: true }); // Store personal details in Firestore
      setSuccess(true);
    } catch (error) {
      console.error("Error saving personal details:", error);
      setError("Failed to save personal details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Personal Details</h2>
      {loading && <p>Loading...</p>}
      {success && <p className="success-message">Personal details updated successfully!</p>}
      {error && <p className="error-message">{error}</p>}

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
          <label>Skill</label>
          <input
            type="text"
            name="skills"
            value={personalDetails.skills}
            onChange={handlePersonalDetailsChange}
            className="form-input"
            placeholder="e.g., Drummer"
          />
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
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
