import React, { useState, useEffect } from "react";
import "./ArtistProfile.css"; // CSS for styling
import ArtistSidebar from "./sidebar/ArtistSidebar";
import ArtistHeader from "./header/ArtistHeader";
import {
  FaUser,
  FaLock,
  FaBell,
  FaCog,
  FaCalendarAlt,
  FaShieldAlt,
  FaBook,
  FaFolderOpen,
  FaPencilAlt,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaPlus,
} from "react-icons/fa";

const ArtistProfile = ({
  maxFileSize = 5 * 1024 * 1024,
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"],
}) => {
  // Load the previously selected menu from localStorage, default to 'profileInformation'
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("selectedMenu") || "profileInformation"
  );

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // Modal state
  const [showTwoFactorAuthModal, setShowTwoFactorAuthModal] = useState(false); // Two-Factor Auth Modal state
  const [showSecurityQuestionModal, setShowSecurityQuestionModal] =
    useState(false); // Security Question Modal state
  const [showImageModal, setShowImageModal] = useState(false); // For profile picture actions modal

  const [isCodeSent, setIsCodeSent] = useState(false); // Track if verification code was sent
  const [emailOrPhone, setEmailOrPhone] = useState(""); // Stores email or phone
  const [verificationCode, setVerificationCode] = useState(""); // Stores entered verification code
  const [isVerified, setIsVerified] = useState(false); // Whether 2FA is verified

  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false); // To manage drag state
  const [showAll, setShowAll] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const storedCertificates = localStorage.getItem("certificates");
    if (storedCertificates) {
      setPortfolioData({ certificates: JSON.parse(storedCertificates) });
    }
  }, []);

  // added

  // added

  // Handle file validation and uploads
  const handleFileUpload = (files) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file); // Create URL for preview
    setNewCertificate({ ...newCertificate, url: fileUrl });
    const updatedCertificates = [...portfolioData.certificates];
    const newErrors = [];

    Array.from(files).forEach((file) => {
      // Check for file size
      if (file.size > maxFileSize) {
        newErrors.push(
          `${file.name} exceeds the maximum size of ${(
            maxFileSize /
            1024 /
            1024
          ).toFixed(2)}MB.`
        );
        return;
      }

      // Check for valid file types
      if (!acceptedFileTypes.includes(file.type)) {
        newErrors.push(
          `${
            file.name
          } is not an accepted format. Allowed formats: ${acceptedFileTypes.join(
            ", "
          )}`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        updatedCertificates.push({
          name: file.name,
          type: file.type,
          url: reader.result,
        });
        setPortfolioData({ certificates: updatedCertificates });
      };
      reader.readAsDataURL(file);
    });

    setErrors(newErrors);
  };

  // Handle traditional file input
  const handleCertificateUpload = (e) => {
    handleFileUpload(e.target.files);
  };

  // Handle drag-and-drop uploads
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // Remove certificate from the list
  const handleRemoveCertificate = (index) => {
    const updatedCertificates = portfolioData.certificates.filter(
      (_, i) => i !== index
    );
    setPortfolioData({ certificates: updatedCertificates });
  };

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    profilePicture: "",
    bio: "",
    isPublicProfile: true,
    location: "",
  });

  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    pronouns: "",
    preferredLanguage: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    securityQuestion: "",
    securityAnswer: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      marketing: false,
      bookingUpdates: true,
    },
    smsNotifications: false,
    pushNotifications: true,
    soundAlerts: false,
  });

  const [bookingPreferences, setBookingPreferences] = useState({
    availability: "",
    bookingAlerts: false,
    bookingPolicies: "",
    pricing: "",
  });

  // Fetch profile data from localStorage on component mount to pre-fill the form
  useEffect(() => {
    // Retrieve profile information from localStorage
    const storedProfilePic = localStorage.getItem("profilePicture");
    const storedUsername = localStorage.getItem("username");
    const storedName = localStorage.getItem("name");
    const storedBio = localStorage.getItem("bio");
    const storedLocation = localStorage.getItem("location");

    // Retrieve personal details from localStorage
    const storedDetails = localStorage.getItem("personalDetails");
    const parsedDetails = storedDetails ? JSON.parse(storedDetails) : {};

    // Retrieve password data from localStorage
    const storedPasswordData = localStorage.getItem("passwordData");
    const parsedPasswordData = storedPasswordData
      ? JSON.parse(storedPasswordData)
      : {};

    // Retrieve notification settings from localStorage
    const storedNotifications = localStorage.getItem("notificationSettings");
    const parsedNotifications = storedNotifications
      ? JSON.parse(storedNotifications)
      : {};

    // Retrieve booking preferences from localStorage
    const storedBookingPreferences = localStorage.getItem("bookingPreferences");
    const parsedBookingPreferences = storedBookingPreferences
      ? JSON.parse(storedBookingPreferences)
      : {};

    setProfileData((prevData) => ({
      ...prevData,
      profilePicture: storedProfilePic || prevData.profilePicture,
      username: storedUsername || prevData.username,
      name: storedName || prevData.name,
      bio: storedBio || prevData.bio,
      location: storedLocation || prevData.location,
    }));

    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      ...parsedDetails,
    }));

    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      ...parsedPasswordData,
    }));

    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      ...parsedNotifications,
    }));

    setBookingPreferences((prevBookingPreferences) => ({
      ...prevBookingPreferences,
      ...parsedBookingPreferences,
    }));
  }, []);

  // Handle input changes for profile information
  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input changes for personal details
  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({
      ...personalDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input changes for password and security
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

  // Handle input changes for notifications
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

  // Handle input changes for booking preferences
  const handleBookingPreferencesChange = (e) => {
    const { name, value, checked, type } = e.target;
    setBookingPreferences({
      ...bookingPreferences,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Toggle modals
  const toggleChangePasswordModal = () =>
    setShowChangePasswordModal(!showChangePasswordModal);
  const toggleTwoFactorAuthModal = () =>
    setShowTwoFactorAuthModal(!showTwoFactorAuthModal);
  const toggleSecurityQuestionModal = () =>
    setShowSecurityQuestionModal(!showSecurityQuestionModal);

  // Mock function to simulate sending a verification code

  // State for password visibility
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

  const sendVerificationCode = () => {
    if (emailOrPhone) {
      setIsCodeSent(true); // Simulate code sent
    }
  };

  // Mock function to verify the code
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

  // Save button functionality: Save the form data into localStorage
  // Refresh the page and keep the user on the same menu section
  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Store profile information in localStorage
    localStorage.setItem("name", profileData.name);
    localStorage.setItem("username", profileData.username);
    localStorage.setItem("bio", profileData.bio);
    localStorage.setItem("location", profileData.location);
    localStorage.setItem("profilePicture", profileData.profilePicture);

    // Store personal details in localStorage
    localStorage.setItem("personalDetails", JSON.stringify(personalDetails));

    // Store password data in localStorage
    localStorage.setItem("passwordData", JSON.stringify(passwordData));

    // Store notification settings in localStorage
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(notificationSettings)
    );

    // Store booking preferences in localStorage
    localStorage.setItem(
      "bookingPreferences",
      JSON.stringify(bookingPreferences)
    );

    // Store the currently selected menu
    localStorage.setItem("selectedMenu", selectedMenu);

    // Reload the page to reflect the changes and keep the same menu
    window.location.reload();

    e.preventDefault();
    if (errors.length === 0) {
      localStorage.setItem(
        "certificates",
        JSON.stringify(portfolioData.certificates)
      );
      alert("Portfolio updated and saved successfully!");
    } else {
      alert("Please resolve the errors before saving.");
    }
  };

  // Function to handle menu changes
  const handleMenuChange = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem("selectedMenu", menu); // Store selected menu in localStorage
  };

  ///////////////////////////////////

  const [portfolioData, setPortfolioData] = useState({
    certificates: [
      {
        id: 1,
        name: "Certificate of Participation",
        org: "Google Developer Student Clubs",
        date: "Apr 2024",
        url: "certificate-url.png", // Placeholder for certificate icon/image
      },
      {
        id: 2,
        name: "Certificate for Teaching Assistantship",
        org: "Forman Christian College",
        date: "Feb 2024",
        url: "certificate-url2.png", // Placeholder for certificate icon/image
      },
    ],
  });

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [isEditing, setIsEditing] = useState(false); // State for differentiating add/edit

  const [currentCertificate, setCurrentCertificate] = useState(null); // Current certificate being edited
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    org: "",
    date: "",
    url: "",
  });

  const handleAddCertificate = () => {
    setIsEditing(false); // Set to false to indicate adding mode
    setNewCertificate({ name: "", org: "", date: "", url: "" });
    setShowModal(true); // Show modal
  };

  const handleEditCertificate = () => {
    setIsEditing(true); // Set to true to indicate editing mode
    setShowModal(true); // Show modal
  };

  const handleSaveCertificate = () => {
    if (isEditing) {
      const updatedCertificates = [...portfolioData.certificates];
      updatedCertificates[currentCertificate] = newCertificate; // Update existing certificate
      setPortfolioData({ certificates: updatedCertificates });
    } else {
      // Add new certificate
      setPortfolioData({
        certificates: [...portfolioData.certificates, newCertificate],
      });
    }
    setShowModal(false); // Close modal after saving
  };

  const handleDeleteCertificate = (indexToDelete) => {
    const updatedCertificates = portfolioData.certificates.filter(
      (_, index) => index !== indexToDelete
    );
    setPortfolioData({ certificates: updatedCertificates });
    setShowModal(false); // Close modal after deletion
  };
  ///////////////////////////////////
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

              {/* Profile Visibility */}
              <div className="form-section">
                <label>Profile Visibility</label>
                <input
                  type="checkbox"
                  name="isPublicProfile"
                  checked={profileData.isPublicProfile}
                  onChange={handleInputChange}
                />{" "}
                Public Profile
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
      case "passwordSecurity":
        return (
          <div className="profile-section">
            <h2>Password & Security</h2>
            <div className="security-menu">
              <button
                className="security-option"
                onClick={toggleChangePasswordModal}
              >
                Change Password
                <FaChevronRight />
              </button>
              <button
                className="security-option"
                onClick={toggleTwoFactorAuthModal}
              >
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
                            isPasswordVisible.currentPassword
                              ? "text"
                              : "password"
                          }
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="form-input"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={() =>
                            togglePasswordVisibility("currentPassword")
                          }
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
                          type={
                            isPasswordVisible.newPassword ? "text" : "password"
                          }
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="form-input"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                        >
                          {isPasswordVisible.newPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="form-section">
                      <label>Confirm New Password</label>
                      <div className="password-field">
                        <input
                          type={
                            isPasswordVisible.confirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="form-input"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
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
                        <label>
                          Enter your registered email or phone number
                        </label>
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
      case "personalDetails":
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
      case "notifications":
        return (
          <div className="profile-section">
            <h2>Notifications</h2>
            <form onSubmit={handleSaveChanges}>
              <div className="form-section">
                <label>Email Notifications (Marketing)</label>
                <input
                  type="checkbox"
                  name="emailNotifications.marketing"
                  checked={notificationSettings.emailNotifications.marketing}
                  onChange={handleNotificationChange}
                />{" "}
                Receive marketing emails
              </div>

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
                <label>Sound Alerts</label>
                <input
                  type="checkbox"
                  name="soundAlerts"
                  checked={notificationSettings.soundAlerts}
                  onChange={handleNotificationChange}
                />{" "}
                Enable sound alerts for notifications
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
      case "bookingPreferences":
        return (
          <div className="profile-section">
            <h2>Booking Preferences</h2>
            <form onSubmit={handleSaveChanges}>
              <div className="form-section">
                <label>Availability Calendar</label>
                <input
                  type="date"
                  name="availability"
                  value={bookingPreferences.availability}
                  onChange={handleBookingPreferencesChange}
                  className="form-input"
                  placeholder="Select available dates"
                />
              </div>

              <div className="form-section">
                <label>Booking Alerts</label>
                <input
                  type="checkbox"
                  name="bookingAlerts"
                  checked={bookingPreferences.bookingAlerts}
                  onChange={handleBookingPreferencesChange}
                />{" "}
                Enable Booking Alerts
              </div>

              <div className="form-section">
                <label>Booking Policies (Cancellation, Refunds)</label>
                <textarea
                  name="bookingPolicies"
                  value={bookingPreferences.bookingPolicies}
                  onChange={handleBookingPreferencesChange}
                  className="form-input"
                  rows="4"
                  placeholder="Enter your booking policies (cancellation, refund)"
                />
              </div>

              <div className="form-section">
                <label>Rates and Pricing</label>
                <input
                  type="number"
                  name="pricing"
                  value={bookingPreferences.pricing}
                  onChange={handleBookingPreferencesChange}
                  className="form-input"
                  placeholder="Enter hourly or package rates"
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
                <label>Who Can See My Posts</label>
                <select className="form-input">
                  <option value="public">Public</option>
                  <option value="followers">Only Followers</option>
                  <option value="clients">Only Clients</option>
                </select>
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
      case "artistPortfolio":
        return (
          <div className="profile-section">
            <h2>Artist Portfolio</h2>

            {/* Portfolio Link */}
            <div className="form-section">
              <label>Portfolio Link</label>
              <input
                type="text"
                className="form-input"
                placeholder="Add external link to your portfolio"
              />
            </div>

            {/* Certifications Section */}
            <div className="certification-section">
              <div className="certification-header">
                <h3>Licenses & certifications</h3>
                <div className="certification-actions">
                  <button
                    className="add-certification"
                    onClick={handleAddCertificate}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="edit-certification"
                    onClick={handleEditCertificate}
                  >
                    <FaPencilAlt />
                  </button>
                </div>
              </div>

              {/* Certificate List */}
              <ul className="certification-list">
                {portfolioData.certificates
                  .slice(0, showAll ? portfolioData.certificates.length : 2)
                  .map((cert, index) => (
                    <li
                      key={index}
                      className="certification-item"
                      onClick={() => setSelectedCertificate(cert)}
                    >
                      <div className="cert-info">
                        <span className="cert-name">{cert.name}</span>
                        <span className="cert-org">Issued by {cert.org}</span>
                        <span className="cert-date">Issued {cert.date}</span>
                      </div>
                    </li>
                  ))}
              </ul>

              {/* Show All Link */}
              <div className="show-all-link">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAll(!showAll);
                  }}
                >
                  {showAll
                    ? "Show less licenses & certifications"
                    : `Show all ${portfolioData.certificates.length} licenses & certifications`}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="form-section">
              <label>Social Links</label>
              <input
                type="text"
                className="form-input"
                placeholder="Add links to your social media accounts"
              />
            </div>

            {/* Only one Save Button at the bottom */}
            <div className="form-section">
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>

            {/* Modal for Add/Edit/Delete Certificates */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  {/* Conditional rendering based on add or edit mode */}
                  <h3>
                    {isEditing ? "Manage Certificates" : "Add Certificate"}
                  </h3>

                  {isEditing ? (
                    <div>
                      {/* Show list of certificates with delete buttons */}
                      <ul className="certification-list">
                        {portfolioData.certificates.map((cert, index) => (
                          <li key={index} className="certification-item">
                            <div className="cert-info">
                              <span className="cert-name">{cert.name}</span>
                              <span className="cert-org">
                                Issued by {cert.org}
                              </span>
                              <span className="cert-date">
                                Issued {cert.date}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteCertificate(index)}
                              className="remove-button"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      {/* Add new certificate form */}
                      <div className="form-section">
                        <label>Certificate Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={newCertificate.name}
                          onChange={(e) =>
                            setNewCertificate({
                              ...newCertificate,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-section">
                        <label>Issuing Organization</label>
                        <input
                          type="text"
                          className="form-input"
                          value={newCertificate.org}
                          onChange={(e) =>
                            setNewCertificate({
                              ...newCertificate,
                              org: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-section">
                        <label>Issue Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={newCertificate.date}
                          onChange={(e) =>
                            setNewCertificate({
                              ...newCertificate,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-section">
                        <label>Upload Certificate (PDF/Image)</label>
                        <input
                          type="file"
                          className="form-input"
                          onChange={handleFileUpload}
                        />
                      </div>

                      <div className="form-section">
                        <button
                          onClick={handleSaveCertificate}
                          className="save-button"
                        >
                          Add Certificate
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal for Viewing Certificate Details */}
            {selectedCertificate && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Certificate Details</h3>
                  <div className="cert-details">
                    <p>
                      <strong>Certificate Name:</strong>{" "}
                      {selectedCertificate.name}
                    </p>
                    <p>
                      <strong>Issued By:</strong> {selectedCertificate.org}
                    </p>
                    <p>
                      <strong>Issued Date:</strong> {selectedCertificate.date}
                    </p>
                    {selectedCertificate.fileUrl && (
                      <p>
                        <strong>View/Download Certificate:</strong>{" "}
                        <a
                          href={selectedCertificate.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View or Download
                        </a>
                      </p>
                    )}
                  </div>
                  <button
                    className="close-button"
                    onClick={() => setSelectedCertificate(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="artist-dashboard">
      <ArtistSidebar />
      <div className="artist-main-dashboard">
        <ArtistHeader />
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
              onClick={() => handleMenuChange("passwordSecurity")}
              className={selectedMenu === "passwordSecurity" ? "active" : ""}
            >
              <FaLock />
              &nbsp; Password & Security
            </li>
            <li
              onClick={() => handleMenuChange("personalDetails")}
              className={selectedMenu === "personalDetails" ? "active" : ""}
            >
              <FaBook />
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
              onClick={() => handleMenuChange("bookingPreferences")}
              className={selectedMenu === "bookingPreferences" ? "active" : ""}
            >
              <FaCalendarAlt />
              &nbsp; Booking Preferences
            </li>
            <li
              onClick={() => handleMenuChange("accountSettings")}
              className={selectedMenu === "accountSettings" ? "active" : ""}
            >
              <FaCog />
              &nbsp; Account Settings
            </li>
            <li
              onClick={() => handleMenuChange("privacySettings")}
              className={selectedMenu === "privacySettings" ? "active" : ""}
            >
              <FaShieldAlt />
              &nbsp; Privacy Settings
            </li>
            <li
              onClick={() => handleMenuChange("artistPortfolio")}
              className={selectedMenu === "artistPortfolio" ? "active" : ""}
            >
              <FaFolderOpen />
              &nbsp; Artist Portfolio
            </li>
          </ul>
        </div>
        <div className="artist-profile-section">{renderSection()}</div>
      </div>
    </div>
  );
};

export default ArtistProfile;
