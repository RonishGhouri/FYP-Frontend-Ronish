import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../AuthNavbar/AuthNavbar';  // Assuming you have a Navbar component
import './Login.css';  // Assuming you have specific styles for login

const Login = () => {
  const [email, setEmail] = useState('');       // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState('');       // State for error messages
  const [loading, setLoading] = useState(false);// State for loading spinner
  const navigate = useNavigate();               // React Router hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);                           // Set loading state to true
    setError('');                               // Clear previous errors

    // Validate that email and password are filled in
    if (!email || !password) {
      setError('Please fill in all the fields');
      setLoading(false);
      return;
    }

    try {
      // Make a POST request to the login endpoint with email and password
      const response = await axios.post('http://localhost:8000/accounts/login/', { 
        email, 
        password 
      });

      // Handle the response if login is successful
      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('role', response.data.role);

        // Redirect based on the user role
        switch(response.data.role) {
          case 'artist':
            navigate('/artistwelcome');
            break;
          case 'artist_manager':
            navigate('/artistmanagerwelcome');
            break;
          case 'company':
            navigate('/companywelcome');
            break;
          case 'manager':
            navigate('/managerwelcome');
            break;
          case 'consumer':
            navigate('/consumerwelcome');
            break;
          default:
            setError('Unknown user role');
            break;
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      // Handle errors from the server
      if (err.response && err.response.data) {
        if (err.response.status === 400) {
          setError('Email or password is incorrect.');
        } else if (err.response.status === 404) {
          setError('User not found.');
        } else {
          setError(err.response.data.detail || 'Login failed. Please try again later.');
        }
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Welcome Back</h2>
        <p className="subheading">Log in to your account</p>
        {error && <p className="error-msg">{error}</p>} {/* Display error message */}
        
        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="auth-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="auth-input"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Show loading text when login is in progress */}
          </button>
        </form>

        {/* Forgot password link */}
        <p className="auth-footer">
          Forgot your password? <Link to="/password-reset" className="auth-link">Reset it here</Link>
        </p>

        {/* Signup Link */}
        <p className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
