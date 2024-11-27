import React from "react";
import "./PasswordSecurity.css";
import { useState, useEffect } from "react";

import {
    FaEye,
    FaEyeSlash,
  } from "react-icons/fa";

const PasswordSecurity = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  
  const handleSaveChanges = () => {
    alert("Changes saved!");
  };

  return (
    <div className="profile-section">
      <h2>Password & Security</h2>
      <form>
        <div className="form-section">
          <label>Current Password</label>
          <div className="password-field">
            <input
              type={isPasswordVisible.currentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="form-input"
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility("currentPassword")}
            >
              {isPasswordVisible.currentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-section">
          <label>New Password</label>
          <div className="password-field">
            <input
              type={isPasswordVisible.newPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="form-input"
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {isPasswordVisible.newPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-section">
          <label>Confirm New Password</label>
          <div className="password-field">
            <input
              type={isPasswordVisible.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="form-input"
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {isPasswordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
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

export default PasswordSecurity;
