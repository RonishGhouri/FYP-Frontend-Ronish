import React from "react";
import  { useState, useEffect } from "react";

import "./PersonalDetails.css";
function PersonalDetails() {
  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    pronouns: "",
    preferredLanguage: "",
  });

  useEffect(() => {
    // Retrieve personal details from localStorage

    const storedDetails = localStorage.getItem("personalDetails");
    const parsedDetails = storedDetails ? JSON.parse(storedDetails) : {};

    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      ...parsedDetails,
    }));
  }, []);

  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({
      ...personalDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Store personal details in localStorage
    localStorage.setItem("personalDetails", JSON.stringify(personalDetails));
  };
  return (
    <div className="profile-section">
      <h2>Personal Details</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={personalDetails.email}
            onChange={handlePersonalDetailsChange}
            className="form-input"
            placeholder="Email"
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
          <label>Pronouns (Optional)</label>
          <input
            type="text"
            name="pronouns"
            value={personalDetails.pronouns}
            onChange={handlePersonalDetailsChange}
            className="form-input"
            placeholder="e.g., he/him, she/her, they/them"
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
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
