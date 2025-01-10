import React, { useState } from 'react';
import { FaLock, FaShieldAlt, FaHistory } from 'react-icons/fa';
import './artistPaymentSecurity.css';

const ArtistPaymentSecurity = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    paymentAlerts: true,
    securityAlerts: true
  });

  const [activityLog] = useState([
    {
      id: 1,
      action: 'Added new payout method',
      date: new Date(),
      ip: '192.168.1.10'
    },
    {
      id: 2,
      action: 'Updated security settings',
      date: new Date(Date.now() - 86400000),
      ip: '192.168.1.10'
    }
  ]);

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="artist-payment-security">
      <div className="artist-security-settings">
        <h2>Security Settings</h2>
        
        <div className="artist-setting-card">
          <div className="artist-setting-header">
            <FaLock className="artist-setting-icon" />
            <div className="artist-setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your payment activities</p>
            </div>
          </div>
          <label className="artist-switch">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={() => handleSettingChange('twoFactorAuth')}
            />
            <span className="artist-slider"></span>
          </label>
        </div>

        <div className="artist-setting-card">
          <div className="artist-setting-header">
            <FaShieldAlt className="artist-setting-icon" />
            <div className="artist-setting-info">
              <h3>Payout Alerts</h3>
              <p>Get notified about all payout activities</p>
            </div>
          </div>
          <label className="artist-switch">
            <input
              type="checkbox"
              checked={settings.paymentAlerts}
              onChange={() => handleSettingChange('paymentAlerts')}
            />
            <span className="artist-slider"></span>
          </label>
        </div>

        <div className="artist-setting-card">
          <div className="artist-setting-header">
            <FaShieldAlt className="artist-setting-icon" />
            <div className="artist-setting-info">
              <h3>Security Alerts</h3>
              <p>Get notified about suspicious activities</p>
            </div>
          </div>
          <label className="artist-switch">
            <input
              type="checkbox"
              checked={settings.securityAlerts}
              onChange={() => handleSettingChange('securityAlerts')}
            />
            <span className="artist-slider"></span>
          </label>
        </div>
      </div>

      <div className="artist-activity-log">
        <h2>Recent Security Activity</h2>
        <div className="artist-log-list">
          {activityLog.map(activity => (
            <div key={activity.id} className="artist-log-item">
              <FaHistory className="artist-log-icon" />
              <div className="artist-log-details">
                <p className="artist-log-action">{activity.action}</p>
                <p className="artist-log-meta">
                  {activity.date.toLocaleDateString()} • IP: {activity.ip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistPaymentSecurity;
