import React from "react";
import "./Pricing.css";
import p1 from "../../../assets/budget.jpg";
import p2 from "../../../assets/no_signup_fees.jpg";
import p3 from "../../../assets/fees.jpg";

const Pricing = () => {
  return (
    <div className="pricing-container">
      <div className="pricing-item">
        <img src={p1} alt="" />
        <div className="pricing-caption">
          <p>You can find artists according to your taste of music and budget.</p>
        </div>
      </div>
      <div className="pricing-item">
        <img src={p2} alt="" />
        <div className="pricing-caption">
          <p>No sign-up fees!</p>
        </div>
      </div>
      <div className="pricing-item">
        <img src={p3} alt="" />
        <div className="pricing-caption">
          <p>
            10% of the total payment of each event as service fees made to
            Kalakaar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
