import React, { useState, useEffect } from "react";
import "./ClientProfile.css";
import ClientSidebar from "./sidebar/ClientSidebar";
import ClientHeader from "./header/ClientHeader";
import {
  FaUser,
  FaLock,
  FaBell,
  FaCog,
  FaCalendarAlt,
  FaShieldAlt,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaPencilAlt,
} from "react-icons/fa";

const ClientProfile = () => {
  const [showImageModal, setShowImageModal] = useState(false); // Moved inside the function component
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("selectedMenu") || "profileInformation"
  );

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    profilePicture: "",
    bio: "",
    location: "",
  });

  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    phone: "",
    preferredLanguage: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      bookingUpdates: true,
    },
    smsNotifications: false,
    pushNotifications: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const newProfilePic = fileReader.result;

      // Update the profile picture in the state and localStorage
      setProfileData({
        ...profileData,
        profilePicture: newProfilePic,
      });
      localStorage.setItem("profilePicture", newProfilePic); // Store profile pic in localStorage for the header and profile info section
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  // Function to remove the current profile picture
  const handleRemovePhoto = () => {
    setProfileData({ ...profileData, profilePicture: "default-avatar.png" });
    localStorage.setItem("profilePicture", "default-avatar.png"); // Store default image in localStorage
    setShowImageModal(false); // Close modal after removing
  };

  const handleMenuChange = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem("selectedMenu", menu);
  };

  useEffect(() => {
    const storedProfileData =
      JSON.parse(localStorage.getItem("clientProfileData")) || {};
    const storedPersonalDetails =
      JSON.parse(localStorage.getItem("clientPersonalDetails")) || {};
    const storedNotificationSettings =
      JSON.parse(localStorage.getItem("clientNotificationSettings")) || {};
    setProfileData((prevData) => ({ ...prevData, ...storedProfileData }));
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      ...storedPersonalDetails,
    }));
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      ...storedNotificationSettings,
    }));
  }, []);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    if (name.startsWith("emailNotifications")) {
      const notificationType = name.split(".")[1];
      setNotificationSettings({
        ...notificationSettings,
        emailNotifications: {
          ...notificationSettings.emailNotifications,
          [notificationType]: checked,
        },
      });
    } else {
      setNotificationSettings({
        ...notificationSettings,
        [name]: checked,
      });
    }
  };

  const handleSaveChanges = () => {
    localStorage.setItem("clientProfileData", JSON.stringify(profileData));
    localStorage.setItem(
      "clientPersonalDetails",
      JSON.stringify(personalDetails)
    );
    localStorage.setItem(
      "clientNotificationSettings",
      JSON.stringify(notificationSettings)
    );
    alert("Changes saved!");
  };

  const renderSection = () => {
    switch (selectedMenu) {
      case "profileInformation":
        return (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <form onSubmit={handleSaveChanges}>
              {/* Profile Picture */}
              <div className="profile-picture-wrapper">
                <div className="profile-picture-section">
                  <img
                    src={profileData.profilePicture || "default-avatar.png"}
                    alt="Profile"
                    className="profile-picture"
                    onClick={() => setShowImageModal(true)} // Open modal on image click
                  />
                  <FaPencilAlt
                    className="edit-icon"
                    onClick={() => setShowImageModal(true)}
                  />{" "}
                  {/* Pencil Icon for edit indication */}
                </div>
                {/* Modal for Upload/Remove options */}
                {showImageModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>Change Profile Photo</h3>
                      <button
                        className="modal-upload-button"
                        onClick={() => {
                          document.getElementById("profilePicture").click(); // Trigger file input
                          setShowImageModal(false); // Close modal after clicking upload
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
                        onClick={() => setShowImageModal(false)} // Close modal on cancel
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
                  style={{ display: "none" }} // Hide the file input
                />
              </div>
              {/* Name and Username */}
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

              <div className="form-section">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              {/* Bio */}
              <div className="form-section">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="4"
                  placeholder="A short description or bio about yourself."
                />
              </div>

              

              {/* Location */}
              <div className="form-section">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="City or Country"
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
      case "personalDetails":
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
      case "notifications":
        return (
          <div className="profile-section">
            <h2>Notifications</h2>
            <form>
              <div className="form-section">
                <label>Email Notifications (Booking Updates)</label>
                <input
                  type="checkbox"
                  name="emailNotifications.bookingUpdates"
                  checked={
                    notificationSettings.emailNotifications.bookingUpdates
                  }
                  onChange={handleNotificationChange}
                />{" "}
                Receive booking update emails
              </div>

              <div className="form-section">
                <label>SMS Notifications</label>
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationChange}
                />{" "}
                Enable SMS notifications
              </div>

              <div className="form-section">
                <label>Push Notifications</label>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationChange}
                />{" "}
                Enable push notifications
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
      case "passwordSecurity":
        return (
          <div className="profile-section">
            <h2>Password & Security</h2>
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
                  onClick={handleSaveChanges}
                  className="save-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );
      case "privacySettings":
        return (
          <div className="profile-section">
            <h2>Privacy Settings</h2>
            <form>
              <div className="form-section">
                <label>Who Can See My Profile</label>
                <select className="form-input">
                  <option value="public">Public</option>
                  <option value="followers">Only Followers</option>
                  <option value="clients">Only Clients</option>
                </select>
              </div>

              <div className="form-section">
                <label>Who Can Send Me Messages</label>
                <select className="form-input">
                  <option value="everyone">Everyone</option>
                  <option value="followers">Only Followers</option>
                  <option value="clients">Only Clients</option>
                </select>
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
      case "accountSettings":
        return (
          <div className="profile-section">
            <h2>Account Settings</h2>
            <h4>Deactivating or Deleting Your Account</h4>
            <p>
              If you want to take a break from the platform, you can temporarily
              deactivate your account. If you want to permanently delete your
              account, you can delete your account.
            </p>

            <div className="account-options">
              <div className="option-section">
                <label htmlFor="deactivate" className="option-title">
                  <div className="text-and-radio">
                    <div className="text-content">
                      <strong>Deactivate account</strong>
                      <p>
                        Deactivating your account is temporary. Your profile and
                        content (portfolio, events, bookings) will be hidden,
                        and new bookings will be paused. Existing bookings
                        remain active. You can reactivate anytime by logging in.
                      </p>
                    </div>
                    <input type="radio" id="deactivate" name="accountOption" />
                  </div>
                </label>
              </div>

              <div className="option-section">
                <label htmlFor="delete" className="option-title">
                  <div className="text-and-radio">
                    <div className="text-content">
                      <strong>Delete account</strong>
                      <p>
                        Deleting your account is permanent. All your profile
                        data, content, and bookings will be permanently deleted
                        and cannot be recovered. This action cannot be undone.
                      </p>
                    </div>
                    <input type="radio" id="delete" name="accountOption" />
                  </div>
                </label>
              </div>
            </div>

            <div className="action-buttons">
              <button className="primary-button">Continue</button>
              <button className="secondary-button">Cancel</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />
        <div className="menu-section">
          <ul>
            <li
              onClick={() => handleMenuChange("profileInformation")}
              className={selectedMenu === "profileInformation" ? "active" : ""}
            >
              <FaUser />
              &nbsp; Profile Information
            </li>
            <li
              onClick={() => handleMenuChange("personalDetails")}
              className={selectedMenu === "personalDetails" ? "active" : ""}
            >
              <FaCalendarAlt />
              &nbsp; Personal Details
            </li>
            <li
              onClick={() => handleMenuChange("notifications")}
              className={selectedMenu === "notifications" ? "active" : ""}
            >
              <FaBell />
              &nbsp; Notifications
            </li>
            <li
              onClick={() => handleMenuChange("passwordSecurity")}
              className={selectedMenu === "passwordSecurity" ? "active" : ""}
            >
              <FaLock />
              &nbsp; Password & Security
            </li>
            <li
              onClick={() => handleMenuChange("privacySettings")}
              className={selectedMenu === "privacySettings" ? "active" : ""}
            >
              <FaShieldAlt />
              &nbsp; Privacy Settings
            </li>
            <li
              onClick={() => handleMenuChange("accountSettings")}
              className={selectedMenu === "accountSettings" ? "active" : ""}
            >
              <FaCog />
              &nbsp; Account Settings
            </li>
          </ul>
        </div>
        <div className="client-profile-section">{renderSection()}</div>
      </div>
    </div>
  );
};

export default ClientProfile;
