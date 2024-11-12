import React from "react";
import "./ClientSidebar.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import {
  FaBell,
  FaUser,
  FaHome,
  FaCalendarAlt,
  FaSearch,
  FaCreditCard,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdEventNote } from "react-icons/md";

const ClientSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="client-sidebar">
      <RouterLink to="/client-dashboard">
        <img src={logo} alt="logo" className="client-logo" />
      </RouterLink>
      <ul>
        <li>
          <RouterLink to="/client">
            <FaHome className="client-sidebar-icon" /> Overview
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/client/profile">
            <FaUser className="client-sidebar-icon" /> Manage Profile
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/client/artists">
            <FaSearch className="client-sidebar-icon" /> Browse Artists
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/client/bookings">
            <MdEventNote className="client-sidebar-icon" /> Manage Bookings
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/client/events">
            <FaCalendarAlt className="client-sidebar-icon" /> Events & Invitations
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/client/payments">
            <FaCreditCard className="client-sidebar-icon" /> Payments
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/client/chats">
            <FaComments className="client-sidebar-icon" /> Chats
          </RouterLink>
        </li>
      </ul>

      <button className="client-logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="client-sidebar-icon" /> Logout
      </button>
    </aside>
  );
};

export default ClientSidebar;
