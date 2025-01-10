import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Firebase configuration
import Navbar from '../AuthNavbar/AuthNavbar';
import './NewPassword.css';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams(); // Access query parameters
  const navigate = useNavigate();

  const oobCode = searchParams.get('oobCode'); // Get oobCode from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Verify the reset code
      await verifyPasswordResetCode(auth, oobCode);

      // Confirm the new password
      await confirmPasswordReset(auth, oobCode, newPassword);

      setSuccess('Your password has been successfully updated.');
      // Redirect to login page after success
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password. Please try again or request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Set New Password</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className="auth-input"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="auth-input"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
