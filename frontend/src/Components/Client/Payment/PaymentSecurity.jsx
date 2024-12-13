import React, { useState } from 'react';
import { FaLock, FaShieldAlt, FaHistory } from 'react-icons/fa';
import './paymentSecurity.css';

const PaymentSecurity = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    paymentAlerts: true,
    securityAlerts: true
  });

  const [activityLog] = useState([
    {
      id: 1,
      action: 'Added new payment method',
      date: new Date(),
      ip: '192.168.1.1'
    },
    {
      id: 2,
      action: 'Changed security settings',
      date: new Date(Date.now() - 86400000),
      ip: '192.168.1.1'
    }
  ]);

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="payment-security">
      <div className="security-settings">
        <h2>Security Settings</h2>
        
        <div className="setting-card">
          <div className="setting-header">
            <FaLock className="setting-icon" />
            <div className="setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your payment activities</p>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={() => handleSettingChange('twoFactorAuth')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <FaShieldAlt className="setting-icon" />
            <div className="setting-info">
              <h3>Payment Alerts</h3>
              <p>Get notified about all payment activities</p>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.paymentAlerts}
              onChange={() => handleSettingChange('paymentAlerts')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <FaShieldAlt className="setting-icon" />
            <div className="setting-info">
              <h3>Security Alerts</h3>
              <p>Get notified about suspicious activities</p>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.securityAlerts}
              onChange={() => handleSettingChange('securityAlerts')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="activity-log">
        <h2>Recent Security Activity</h2>
        <div className="log-list">
          {activityLog.map(activity => (
            <div key={activity.id} className="log-item">
              <FaHistory className="log-icon" />
              <div className="log-details">
                <p className="log-action">{activity.action}</p>
                <p className="log-meta">
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

export default PaymentSecurity;