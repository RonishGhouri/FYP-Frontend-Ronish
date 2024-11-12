import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../AuthNavbar/AuthNavbar';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to validate password format
  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state before making the request
    setSuccess(false); // Reset success state

    // Basic form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must contain both uppercase and lowercase letters');
      setLoading(false);
      return;
    }

    // API Call to Django Backend (Signup)
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        username,
        email,
        password,
        confirm_password: confirmPassword,
        role,
      });

      // Handle success response
      setSuccess(true);
      setLoading(false);

      // Redirect to login page after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Log the full error response for debugging
      console.error('Error during signup:', err.response);

      // Detailed error handling
      if (err.response && err.response.data) {
        // If we receive specific validation errors from the backend
        if (err.response.data.username) {
          setError(`Username: ${err.response.data.username[0]}`);
        } else if (err.response.data.email) {
          setError(`Email: ${err.response.data.email[0]}`);
        } else if (err.response.data.password) {
          setError(`Password: ${err.response.data.password[0]}`);
        } else if (err.response.data.role) {
          setError(`Role: ${err.response.data.role[0]}`);
        } else {
          // Catch any other errors sent by the backend
          setError(err.response.data.detail || 'An error occurred during signup.');
        }
      } else {
        // Fallback error message if no detailed response is available
        setError('An unexpected error occurred. Please try again.');
      }

      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Create an Account</h2>
        <p className="subheading">Join us today</p>

        {/* Display error message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Display success message */}
        {success && <p className="success-msg">Signup successful! Redirecting to login...</p>}

        {/* Signup form */}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="auth-input"
            autoComplete="username"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="auth-input"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="auth-input"
            autoComplete="new-password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="auth-input"
            autoComplete="new-password"
          />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
            className="auth-input"
          >
            <option value="" disabled>Select Role</option>
            <option value="artist">Artist</option>
            <option value="client">Client</option>
            <option value="manager">Manager</option>
          </select>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
