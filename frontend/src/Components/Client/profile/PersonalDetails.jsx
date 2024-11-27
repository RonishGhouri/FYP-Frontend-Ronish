import React from "react";
import "./PersonalDetails.css";
import { useState, useEffect } from "react";


const PersonalDetails = () => {
  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    phone: "",
    preferredLanguage: "",
  });
  useEffect(() => {
    const storedPersonalDetails =
      JSON.parse(localStorage.getItem("clientPersonalDetails")) || {};
    
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      ...storedPersonalDetails,
    }));
    
  }, []);

  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };
  const handleSaveChanges = () => {
    localStorage.setItem(
      "clientPersonalDetails",
      JSON.stringify(personalDetails)
    );
    alert("Changes saved!");
  };

  return (
    <div className="profile-section">
      <h2>Personal Details</h2>
      <form>
        <div className="form-section">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={personalDetails.email}
            onChange={handlePersonalDetailsChange}
            className="form-input"
          />
        </div>

        <div className="form-section">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={personalDetails.phone}
            onChange={handlePersonalDetailsChange}
            className="form-input"
            placeholder="Phone Number"
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

        <div className="form-section">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="save-button"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetails;
