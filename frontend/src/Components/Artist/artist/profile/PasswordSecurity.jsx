import React from "react";
import { useState, useEffect } from "react";

import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa";
import "./PasswordSecurity.css";

function PasswordSecurity() {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // Modal state
  const [showTwoFactorAuthModal, setShowTwoFactorAuthModal] = useState(false); // Two-Factor Auth Modal state
  const [showSecurityQuestionModal, setShowSecurityQuestionModal] =
    useState(false); // Security Question Modal state

  const [isCodeSent, setIsCodeSent] = useState(false); // Track if verification code was sent

  const [emailOrPhone, setEmailOrPhone] = useState(""); // Stores email or phone
  const [verificationCode, setVerificationCode] = useState(""); // Stores entered verification code
  const [isVerified, setIsVerified] = useState(false); // Whether 2FA is verified

  const toggleChangePasswordModal = () =>
    setShowChangePasswordModal(!showChangePasswordModal);
  const toggleTwoFactorAuthModal = () =>
    setShowTwoFactorAuthModal(!showTwoFactorAuthModal);
  const toggleSecurityQuestionModal = () =>
    setShowSecurityQuestionModal(!showSecurityQuestionModal);

  const [isPasswordVisible, setIsPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const sendVerificationCode = () => {
    if (emailOrPhone) {
      setIsCodeSent(true); // Simulate code sent
    }
  };

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
    twoFactorAuth: false,
    securityQuestion: "",
    securityAnswer: "",
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.checked,
    });
  };

  const verifyCode = () => {
    if (verificationCode === "123456") {
      // Mock valid code
      setIsVerified(true);
      setPasswordData({ ...passwordData, twoFactorAuth: true });
      alert("Two-Factor Authentication Enabled!");
      setShowTwoFactorAuthModal(false); // Close modal after success
    } else {
      alert("Invalid code, please try again.");
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Store password data in localStorage
    localStorage.setItem("passwordData", JSON.stringify(passwordData));
  };

  useEffect(() => {
    // Retrieve password data from localStorage
    const storedPasswordData = localStorage.getItem("passwordData");
    const parsedPasswordData = storedPasswordData
      ? JSON.parse(storedPasswordData)
      : {};

    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      ...parsedPasswordData,
    }));
  }, []);

  return (
    <div className="profile-section">
      <h2>Password & Security</h2>
      <div className="security-menu">
        <button className="security-option" onClick={toggleChangePasswordModal}>
          Change Password
          <FaChevronRight />
        </button>
        <button className="security-option" onClick={toggleTwoFactorAuthModal}>
          Two-Factor Authentication
          <FaChevronRight />
        </button>
        <button
          className="security-option"
          onClick={toggleSecurityQuestionModal}
        >
          Security Question
          <FaChevronRight />
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form>
              <div className="form-section">
                <label>Current Password</label>
                <div className="password-field">
                  <input
                    type={
                      isPasswordVisible.currentPassword ? "text" : "password"
                    }
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
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
                    type={
                      isPasswordVisible.confirmPassword ? "text" : "password"
                    }
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
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
                <button
                  type="button"
                  className="save-button"
                  onClick={() => setShowChangePasswordModal(false)}
                >
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

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Two-Factor Authentication</h3>
            {!isCodeSent ? (
              <>
                <div className="form-section">
                  <label>Enter your registered email or phone number</label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="form-input"
                    placeholder="Email or Phone Number"
                  />
                </div>
                <div className="form-section">
                  <button
                    type="button"
                    className="save-button"
                    onClick={sendVerificationCode}
                  >
                    Send Verification Code
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={toggleTwoFactorAuthModal}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-section">
                  <label>
                    Enter the verification code sent to {emailOrPhone}
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="form-input"
                    placeholder="Verification Code"
                  />
                </div>
                <div className="form-section">
                  <button
                    type="button"
                    className="save-button"
                    onClick={verifyCode}
                  >
                    Verify & Enable 2FA
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={toggleTwoFactorAuthModal}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Security Question Modal */}
      {showSecurityQuestionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Security Question</h3>
            <div className="form-section">
              <label>Security Question</label>
              <input
                type="text"
                name="securityQuestion"
                value={passwordData.securityQuestion}
                onChange={handlePasswordChange}
                className="form-input"
                placeholder="Security Question"
              />
            </div>
            <div className="form-section">
              <label>Security Answer</label>
              <input
                type="text"
                name="securityAnswer"
                value={passwordData.securityAnswer}
                onChange={handlePasswordChange}
                className="form-input"
                placeholder="Answer to Security Question"
              />
            </div>
            <div className="form-section">
              <button
                type="button"
                className="save-button"
                onClick={toggleSecurityQuestionModal}
              >
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={toggleSecurityQuestionModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordSecurity;
