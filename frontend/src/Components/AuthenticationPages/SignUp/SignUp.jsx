import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../AuthNavbar/AuthNavbar';
import { auth, db } from '../../firebaseConfig'; // Import Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
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
    setError(''); // Reset error state before processing the form
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

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role,
        createdAt: new Date(),
      });

      setSuccess(true);
      setLoading(false);

      // Redirect to login page after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
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
