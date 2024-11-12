import React from "react";
import "./ArtistSidebar.css";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../../../assets/logo.png";
import {
  FaBell,
  FaUser,
  FaHome,
  FaCalendarAlt,
  FaFolderOpen,
  FaCreditCard,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdEventNote } from "react-icons/md";

const ArtistSidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside className="artist-sidebar">
      <RouterLink to="/artist/">
        <img src={logo} alt="logo" className="artist-logo" />
      </RouterLink>
      <ul>
        <li>
          <RouterLink to="/artist/">
            <FaHome className="artist-sidebar-icon" /> Overview
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/artist/profile">
            <FaUser className="artist-sidebar-icon" /> Manage Profile
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/artist/bookings">
            <MdEventNote className="artist-sidebar-icon" /> View Bookings
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/artist/events">
            <FaCalendarAlt className="artist-sidebar-icon" /> Manage Events
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/artist/content">
            <FaFolderOpen className="artist-sidebar-icon" /> Manage Content
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/artist/payment">
            <FaCreditCard className="artist-sidebar-icon" /> Payment
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/artist/chats">
            <FaComments className="artist-sidebar-icon" /> Chats
          </RouterLink>
        </li>
      </ul>

      <button className="artist-logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="artist-sidebar-icon" /> Logout
      </button>
    </aside>
  );
};

export default ArtistSidebar;
