import React from "react";
import "./AccountSettings.css";
const AccountSettings = () => {
  return (
    <div className="profile-section">
      <h2>Account Settings</h2>
      <h4>Deactivating or Deleting Your Account</h4>
      <p>
        If you want to take a break from the platform, you can temporarily
        deactivate your account. If you want to permanently delete your account,
        you can delete your account.
      </p>

      <div className="account-options">
        <div className="option-section">
          <label htmlFor="deactivate" className="option-title">
            <div className="text-and-radio">
              <div className="text-content">
                <strong>Deactivate account</strong>
                <p>
                  Deactivating your account is temporary. Your profile and
                  content (portfolio, events, bookings) will be hidden, and new
                  bookings will be paused. Existing bookings remain active. You
                  can reactivate anytime by logging in.
                </p>
              </div>
              <input type="radio" id="deactivate" name="accountOption" />
            </div>
          </label>
        </div>

        <div className="option-section">
          <label htmlFor="delete" className="option-title">
            <div className="text-and-radio">
              <div className="text-content">
                <strong>Delete account</strong>
                <p>
                  Deleting your account is permanent. All your profile data,
                  content, and bookings will be permanently deleted and cannot
                  be recovered. This action cannot be undone.
                </p>
              </div>
              <input type="radio" id="delete" name="accountOption" />
            </div>
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-button">Continue</button>
        <button className="secondary-button">Cancel</button>
      </div>
    </div>
  );
};

export default AccountSettings;
