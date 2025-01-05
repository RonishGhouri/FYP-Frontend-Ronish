import React, { useState, useEffect } from "react";
import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../../authContext";
import { auth } from "../../../firebaseConfig";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import "./PasswordSecurity.css";

function PasswordSecurity() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showTwoFactorAuthModal, setShowTwoFactorAuthModal] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

  const toggleChangePasswordModal = () =>
    setShowChangePasswordModal(!showChangePasswordModal);
  const toggleTwoFactorAuthModal = () =>
    setShowTwoFactorAuthModal(!showTwoFactorAuthModal);

  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha verified:", response);
          },
          "expired-callback": () => {
            console.error("Recaptcha expired. Please verify again.");
          },
        },
        auth
      );
    }
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      initializeRecaptcha();
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setIsCodeSent(true);
      setError("");
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError("Failed to send verification code. Please try again.");
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      await confirmationResult.confirm(verificationCode);
      setSuccess(true);
      setSecurityData({ ...securityData, twoFactorAuth: true });
      alert("Two-Factor Authentication Enabled!");
      setShowTwoFactorAuthModal(false);
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        securityData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, securityData.newPassword);

      setSuccess(true);
      alert("Password updated successfully.");
      setShowChangePasswordModal(false);
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Password & Security</h2>
      {loading && <p>Loading...</p>}
      {success && (
        <p className="success-message">
          Security settings updated successfully!
        </p>
      )}
      {error && <p className="error-message">{error}</p>}

      <div className="security-menu">
        <button className="security-option" onClick={toggleChangePasswordModal}>
          Change Password
          <FaChevronRight />
        </button>
      </div>

      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form onSubmit={handleSaveChanges}>
              <div className="form-section">
                <label>Current Password</label>
                <div className="password-field">
                  <input
                    type={
                      isPasswordVisible.currentPassword ? "text" : "password"
                    }
                    name="currentPassword"
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                  >
                    {isPasswordVisible.currentPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </span>
                </div>
              </div>

              <div className="form-section">
                <label>New Password</label>
                <div className="password-field">
                  <input
                    type={isPasswordVisible.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      })
                    }
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
                    type={
                      isPasswordVisible.confirmPassword ? "text" : "password"
                    }
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {isPasswordVisible.confirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </span>
                </div>
              </div>

              <div className="form-section">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowChangePasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordSecurity;
