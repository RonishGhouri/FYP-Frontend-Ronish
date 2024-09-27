import React from "react";
import "./Footer.css";
import i1 from "../../../assets/inst.jpeg";
import i2 from "../../../assets/in.png";
import i3 from "../../../assets/fb.jpg";

const Footer = () => {
  return (
    <div className="footer">
      <p>@ 2024 Kalakaar </p>
      <ul>
        <li>
          <a href="https://www.youtube.com/">
            <img src={i1} alt="instagram" />
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/">
            <img src={i2} alt="linked in" />
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/">
            <img src={i3} alt="facebook" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
