import React from "react";
import { Link } from "react-router-dom"; // Use react-router-dom for page navigation
import "./AuthNavbar.css";
import logo from "../../../assets/logo.png";

const AuthNavbar = () => {
  return (
    <nav className="container-item dark">
      <Link to="/"> {/* Link to the index page */}
        <img src={logo} alt="Logo" className="logo" />
      </Link>
    </nav>
  );
};

export default AuthNavbar;
