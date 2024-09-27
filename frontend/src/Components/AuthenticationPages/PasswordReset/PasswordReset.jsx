import React, { useState } from 'react';
import axios from 'axios';
import './PasswordReset.css';  // Import the CSS file
import Navbar from '../AuthNavbar/AuthNavbar';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/password_reset/', { email });
      setMessage('A password reset link has been sent to your email.');
      setError('');  // Clear error if successful
    } catch (error) {
      setError('Error occurred. Please try again.');
      setMessage('');  // Clear success message if there's an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar/>
      <div className="auth-form-wrapper">
        <h2>Reset Password</h2>
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="auth-input"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="auth-footer">
          Remember your password? <a href="/login" className="auth-link">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default PasswordReset;
