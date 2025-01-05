import React, { useRef } from "react";
import "./Feature.css";
import next from "../../../assets/next-icon.png";
import back from "../../../assets/back-icon.png";

const Feature = () => {
  const slider = useRef();
  let tx = 0;

  const forward = () => {
    if (tx > -60) {
      tx -= 20;
    }
    slider.current.style.transform = `translateX(${tx}%)`;
  };
  const backward = () => {
    if (tx < 0) {
      tx += 20;
    }
    slider.current.style.transform = `translateX(${tx}%)`;
  };

  return (
    <div className="feature-container">
      <img src={next} className="feature-next" onClick={forward} alt="Next" />
      <img src={back} className="feature-back" onClick={backward} alt="Back" />
      <div className="feature-slider">
        <ul ref={slider}>
          <li>
            <div className="feature-slide">
              <div className="feature-info">
                <div>
                  <h3>Profiles</h3>
                </div>
              </div>
              <p>
                Manage detailed profiles for each artist, including their
                portfolio, biography, and achievements.
              </p>
            </div>
          </li>
          <li>
            <div className="feature-slide">
              <div className="feature-info">
                <div>
                  <h3>Event Management</h3>
                </div>
              </div>
              <p>
                Efficiently schedule and manage events, gigs, and tours for your
                artists.
              </p>
            </div>
          </li>
          <li>
            <div className="feature-slide">
              <div className="feature-info">
                <div>
                  <h3>Contract Management</h3>
                </div>
              </div>
              <p>
                Easily handle contracts and agreements with integrated tools and
                templates.
              </p>
            </div>
          </li>
          <li>
            <div className="feature-slide">
              <div className="feature-info">
                <div>
                  <h3>Financial Tracking</h3>
                </div>
              </div>
              <p>
                Keep track of earnings, expenses, and royalties with
                comprehensive financial management features.
              </p>
            </div>
          </li>
          <li>
            <div className="feature-slide">
              <div className="feature-info">
                <div>
                  <h3>Communication</h3>
                </div>
              </div>
              <p>
                Facilitate communication and collaboration between artists,
                managers, and stakeholders.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Feature;
