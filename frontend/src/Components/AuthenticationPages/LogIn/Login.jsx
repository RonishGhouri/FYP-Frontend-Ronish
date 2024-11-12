import React, { useState } from 'react';
import { useNavigate, Link, redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../AuthNavbar/AuthNavbar';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState(''); // Ensure that you're logging in with the username, not email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure username and password fields are not empty
    if (!username || !password) {
      setError('Please fill in all the fields');
      setLoading(false);
      return;
    }

    // API Call to Django Backend (JWT login)
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username,  // Make sure this matches the backend's expected 'username'
        password,
      });

      // Assuming backend returns access and refresh tokens, and user role
      const { access, refresh, role } = response.data;

      // Store tokens and user role in localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', role);

      // Redirect user based on their role
      switch (role) {
        case 'artist':
          navigate('/artist');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'client':  // Assuming 'customer' is the role instead of 'consumer'
          navigate('/client');
          break;
        default:
          setError('Invalid user role');
          break;
      }

    } catch (err) {
      // Log the full error response for debugging
      console.error('Error during login:', err.response);

      // Handle the error based on response from the backend
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Invalid username or password');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }

      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Welcome Back</h2>
        <p className="subheading">Log in to your account</p>

        {/* Display error message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleLogin}>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="auth-input"
            autoComplete="current-password"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Forgot your password? <Link to="/password-reset" className="auth-link">Reset it here</Link>
        </p>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
