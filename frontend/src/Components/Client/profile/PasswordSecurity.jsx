import React, { useState } from "react";
import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../authContext";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import "./PasswordSecurity.css";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

function PasswordSecurity() {
  const { currentUser } = useAuth();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleChangePasswordModal = () =>
    setShowChangePasswordModal(!showChangePasswordModal);

  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        securityData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, securityData.newPassword);

      toast.success("Password updated successfully.");
      setShowChangePasswordModal(false);
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } 
  };

  return (
    <div className="profile-section">
      <h2>Password & Security</h2>
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
