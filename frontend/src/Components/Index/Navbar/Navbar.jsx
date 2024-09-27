import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll"; // Use Link from react-scroll for smooth scrolling
import { Link as RouterLink } from "react-router-dom"; // Use Link from react-router-dom for routing
import "./Navbar.css";
import logo from "../../../assets/logo.png";
import menu from "../../../assets/menu-icon.png";

const Navbar = () => {
  const [sticky, setsticky] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setsticky(true) : setsticky(false);
    });
  }, []);

  const [mobileMenu, setmobileMenu] = useState(false);
  const toggleMenu = () => {
    setmobileMenu(!mobileMenu);
  };

  return (
    <nav className={`container ${sticky ? "dark" : ""}`}>
      <RouterLink to="/">
        <img src={logo} alt="logo" className="logo" />
      </RouterLink>
      <ul className={mobileMenu ? "" : "hide-mobile-menu"}>
        <li>
          <ScrollLink to="home" smooth={true} 
            duration={500} 
            offset={0} onClick={() => setmobileMenu(false)}>Home</ScrollLink>
        </li>
        <li>
          <ScrollLink 
            to="feature" 
            smooth={true} 
            duration={500} 
            offset={-270}  // Adjust this based on navbar height
            onClick={() => setmobileMenu(false)}
          >
            Features
          </ScrollLink>
        </li>
        <li>
          <ScrollLink 
            to="pricing" 
            smooth={true} 
            duration={500} 
            offset={-290} 
            onClick={() => setmobileMenu(false)}
          >
            Pricing
          </ScrollLink>
        </li>
        <li>
          <ScrollLink 
            to="contact" 
            smooth={true} 
            duration={500} 
            offset={-220} 
            onClick={() => setmobileMenu(false)}
          >
            Contact us
          </ScrollLink>
        </li>
        <li className="a">
          <RouterLink to="/login" className="btn" onClick={() => setmobileMenu(false)}>
            Sign in
          </RouterLink>
        </li>
      </ul>
      <img src={menu} className="menu" onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
