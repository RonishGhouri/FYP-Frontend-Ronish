import React, { useState } from 'react';
import ArtistSidebar from '../sidebar/ArtistSidebar'; // Import Sidebar
import ArtistHeader from '../header/ArtistHeader';   // Import Header
import ArtistPaymentMethods from './ArtistPaymentMethods'; // Add Payment Methods Component
import ReceivedHistory from './ReceivedHistory';
import EarningStats from './EarningStats';
import ArtistPaymentSecurity from './ArtistPaymentSecurity';
import './ArtistPaymentDashboard.css';

const ArtistPaymentDashboard = () => {
  const [activeTab, setActiveTab] = useState('methods'); // Set default tab to 'methods'

  // Render content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case 'methods': // New tab for adding payment methods
        return <ArtistPaymentMethods />;
      case 'history':
        return <ReceivedHistory />;
      case 'stats':
        return <EarningStats />;
      case 'security':
        return <ArtistPaymentSecurity />;
      default:
        return <ArtistPaymentMethods />;
    }
  };

  return (
    <div className="artist-dashboard-wrapper">
        <ArtistSidebar /> {/* Sidebar Component */}
      <div className="artist-paymentdashboard-content">
        <ArtistHeader pageContext="Payments" /> {/* Header Component */}

        <div className="artist-payment-dashboard-wrapper">
          <div className="artist-payment-header">Payment Management</div>
          <div className="artist-payment-tabs-wrapper">
            <div className="artist-payment-tab-buttons">
              <button
                className={`artist-payment-tab-btn ${activeTab === 'methods' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('methods')}
              >
                Payment Methods
              </button>
              <button
                className={`artist-payment-tab-btn ${activeTab === 'history' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Received History
              </button>
              <button
                className={`artist-payment-tab-btn ${activeTab === 'stats' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Earnings Statistics
              </button>
              <button
                className={`artist-payment-tab-btn ${activeTab === 'security' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security Settings
              </button>
            </div>
          </div>

          <div className="artist-payment-content-wrapper">
            {renderContent()} {/* Dynamically render content based on tab */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPaymentDashboard;
