import React, { useState } from 'react';
import ClientSidebar from '../sidebar/ClientSidebar'; // Import Sidebar
import ClientHeader from '../header/ClientHeader';   // Import Header
import PaymentMethods from './PaymentMethods';
import TransactionHistory from './TransactionHistory';
import PaymentStats from './PaymentStats';
import PaymentSecurity from './PaymentSecurity';
import './Payment.css';

const PaymentDashboard = () => {
  const [activeTab, setActiveTab] = useState('methods');

  const renderContent = () => {
    switch (activeTab) {
      case 'methods':
        return <PaymentMethods />;
      case 'transactions':
        return <TransactionHistory />;
      case 'stats':
        return <PaymentStats />;
      case 'security':
        return <PaymentSecurity />;
      default:
        return <PaymentMethods />;
    }
  };

  return (
    <div className="client-dashboard-container">
      <ClientSidebar /> {/* Sidebar Component */}

      <div className="payment-main-content">
        <ClientHeader pageContext="Payments" /> {/* Header Component */}

        <div className="payment-dashboard">
          <div className="payment-title">Payment Management</div>
          <div className="payment-tabs-container">
            <div className="payment-tabs">
              <button
                className={`tab ${activeTab === 'methods' ? 'active' : ''}`}
                onClick={() => setActiveTab('methods')}
              >
                Payment Methods
              </button>
              <button
                className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transaction History
              </button>
              <button
                className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Payment Statistics
              </button>
              <button
                className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security Settings
              </button>
            </div>
          </div>

          <div className="payment-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
