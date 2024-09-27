import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../AuthNavbar/AuthNavbar'
import './SignUp.css'; // Import updated SignUp-specific CSS

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!role) {
      setError('Please select a role.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const requestData = { email, password, role };
      const response = await axios.post('http://localhost:8000/accounts/signup/', requestData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      console.log('Signup successful:', response.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Signup failed');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navba/>
      <div className="auth-form-wrapper">
        <h2>Create an Account</h2>
        <p className="subheading">Join us today</p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSignup}>
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
          <select value={role} onChange={(e) => setRole(e.target.value)} required className="auth-input">
            <option value="" disabled>Select Role</option>
            <option value="artist">Artist</option>
            <option value="consumer">Consumer</option>
            <option value="artist_manager">Artist + Manager</option>
            <option value="company">Company</option>
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
