import React, { useState, useEffect } from "react";
import "./ArtistProfile.css"; // CSS for styling
import ArtistSidebar from "../sidebar/ArtistSidebar";
import ArtistHeader from "../header/ArtistHeader";
import ProfileInformation from "./ProfileInformation";
import PasswordSecurity from "./PasswordSecurity";
import PersonalDetails from "./PersonalDetails";
import {
  FaUser,
  FaLock,
  FaBell,
  FaCog,
  FaCalendarAlt,
  FaShieldAlt,
  FaBook,
  FaFolderOpen,
} from "react-icons/fa";
import Notifications from "./Notifications";
import BookingPreferences from "./BookingPreferences";
import AccountSettings from "./AccountSettings";
import PrivacySettings from "./PrivacySettings";
import ArtistPortfolio from "./ArtistPortfolio";

const ArtistProfile = ({
  maxFileSize = 5 * 1024 * 1024,
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"],
}) => {
  // Load the previously selected menu from localStorage, default to 'profileInformation'
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("selectedMenu") || "profileInformation"
  );



  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  

  // Refresh the page and keep the user on the same menu section
  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Store the currently selected menu
    localStorage.setItem("selectedMenu", selectedMenu);

    // Reload the page to reflect the changes and keep the same menu
    window.location.reload();

  };

  // Function to handle menu changes
  const handleMenuChange = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem("selectedMenu", menu); // Store selected menu in localStorage
  };

  const renderSection = () => {
    switch (selectedMenu) {
      case "profileInformation":
        return <ProfileInformation />;
      case "passwordSecurity":
        return <PasswordSecurity />;
      case "personalDetails":
        return <PersonalDetails />;
      case "notifications":
        return <Notifications />;
      case "bookingPreferences":
        return <BookingPreferences />;
      case "accountSettings":
        return <AccountSettings />;
      case "privacySettings":
        return <PrivacySettings />;
      case "artistPortfolio":
        return <ArtistPortfolio/>;
      default:
        return null;
    }
  };

  return (
    <div className="artist-profile">
      <ArtistSidebar />
      <div className="artist-main-profile">
        <ArtistHeader />
        <div className="menu-sections">
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
