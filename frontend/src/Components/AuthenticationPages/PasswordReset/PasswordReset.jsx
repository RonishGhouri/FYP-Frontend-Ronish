import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../AuthNavbar/AuthNavbar';
import './PasswordReset.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token when the component is mounted
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('/api/accounts/csrf-token/');
        setCsrfToken(response.data.csrfToken); // Assuming your backend sends the CSRF token in this format
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
      }
    };
    getCsrfToken();
  }, []);

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate email before making the request
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // API Call to Django Backend (Password Reset Request)
    try {
      const response = await axios.post(
        '/api/accounts/password_reset/',
        { email },
        {
          headers: {
            'X-CSRFToken': csrfToken, // Include CSRF token in the headers
          },
        }
      );
      setMessage('A password reset link has been sent to your email.');
      setLoading(false);
    } catch (err) {
      // Log the full error response for debugging purposes
      console.error('Error during password reset request:', err.response);

      // Improved error handling with detailed messages from the backend
      if (err.response && err.response.data) {
        // If backend provides specific error messages
        setError(err.response.data.error || 'An error occurred while sending the reset link.');
      } else {
        // Fallback error message for unexpected issues
        setError('An unexpected error occurred. Please try again.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Reset Password</h2>
        {/* Display success message */}
        {message && <p className="success-msg">{message}</p>}
        {/* Display error message */}
        {error && <p className="error-msg">{error}</p>}
        
        {/* Form for password reset */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="auth-input"
            autoComplete="email"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Additional links */}
        <p className="auth-footer">
          Remember your password? <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default PasswordReset;
