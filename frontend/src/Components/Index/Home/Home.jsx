import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "./Home.css";

const Home = () => {
  return (
    <div className='new-home'>
      <div className="new-home-text">
        <h1>Welcome to Kalakaar!</h1> 
        <h2>Where Art Meets Opportunity</h2> {/* Separate the h2 from h1 */}
        <p>
          At Kalakaar, we believe in the power of creativity and the potential of every artist. 
          Whether you're an emerging talent or an established name, our platform is designed to help 
          you connect with opportunities that can elevate your artistic journey.
        </p>
        {/* Use Link to navigate to the signup page */}
        <Link to="/signup">
          <button className='btn-btn'>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
