import React, { useState, useEffect } from "react";
import "./ClientProfile.css";
import ClientSidebar from "../sidebar/ClientSidebar";
import ClientHeader from "../header/ClientHeader";
import {
  FaUser,
  FaLock,
  FaBell,
  FaCog,
  FaCalendarAlt,
  FaShieldAlt,
  
} from "react-icons/fa";
import ProfileInformation from "./ProfileInformation";
import PersonalDetails from "./PersonalDetails";
import Notifications from "./Notifications";
import PasswordSecurity from "./PasswordSecurity";
import PrivacySettings from "./PrivacySettings";
import AccountSettings from "./AccountSettings";

const ClientProfile = () => {
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("selectedMenu") || "profileInformation"
  );

  // Function to remove the current profile picture

  const handleMenuChange = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem("selectedMenu", menu);
  };

  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    alert("Changes saved!");
  };

  const renderSection = () => {
    switch (selectedMenu) {
      case "profileInformation":
        return <ProfileInformation />;
      case "personalDetails":
        return <PersonalDetails />;
      case "notifications":
        return <Notifications />;
      case "passwordSecurity":
        return <PasswordSecurity />;
      case "privacySettings":
        return <PrivacySettings />;
      case "accountSettings":
        return <AccountSettings/>;
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
