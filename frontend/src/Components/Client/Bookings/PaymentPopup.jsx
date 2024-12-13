import React, { useState } from 'react';
import './PaymentPopup.css';
const PaymentPopup = ({ booking, onClose, onConfirm }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');

  const handlePaymentSubmit = () => {
    if (!selectedPaymentMethod || !accountNumber) {
      alert('Please select a payment method and provide the required details.');
      return;
    }
    onConfirm();
  };

  return (
    <div className="payment-popup-overlay" onClick={onClose}>
      <div className="payment-popup-horizontal" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Payment Methods */}
        <div className="payment-methods-section">
          <h3 className="section-title">Select Payment Method</h3>
          <div className="payment-methods">
            <button
              className={`payment-method ${selectedPaymentMethod === 'JazzCash' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('JazzCash')}
            >
              <img src="https://seeklogo.com/images/J/jazz-cash-logo-829841352F-seeklogo.com.png" alt="JazzCash" className="payment-logo" />
              JazzCash
            </button>
            <button
              className={`payment-method ${selectedPaymentMethod === 'EasyPaisa' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('EasyPaisa')}
            >
              <img src="https://websol.biz/wp-content/uploads/2020/09/jazzcash_small-removebg-preview.png" alt="EasyPaisa" className="payment-logo" />
              EasyPaisa
            </button>
            <button
              className={`payment-method ${selectedPaymentMethod === 'Bank' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('Bank')}
            >
              <img src="https://img.favpng.com/9/20/1/online-banking-logo-organization-clip-art-png-favpng-U3WiXXaBFvJuipxBfZ9camEjB.jpg" alt="Bank Transfer" className="payment-logo" />
              Bank Transfer
            </button>
          </div>

          {selectedPaymentMethod && (
            <div className="payment-details">
              {selectedPaymentMethod === 'JazzCash' && (
                <>
                  <p>Enter your JazzCash account number:</p>
                  <input
                    type="text"
                    placeholder="JazzCash Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                  <p className="note">Ensure your JazzCash account is active and has sufficient balance.</p>
                </>
              )}
              {selectedPaymentMethod === 'EasyPaisa' && (
                <>
                  <p>Enter your EasyPaisa account number:</p>
                  <input
                    type="text"
                    placeholder="EasyPaisa Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                  <p className="note">Ensure your EasyPaisa account is active and has sufficient balance.</p>
                </>
              )}
              {selectedPaymentMethod === 'Bank' && (
                <>
                  <p>Enter your bank account number:</p>
                  <input
                    type="text"
                    placeholder="Bank Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                  <p className="note">Ensure your bank account has sufficient balance for the transaction.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="order-summary-section">
          <h3 className="section-title">Order Summary</h3>
          <p><strong>Event Name:</strong> {booking.eventName}</p>
          <p><strong>Event Date:</strong> {booking.date}</p>
          <p><strong>Location:</strong> {booking.location}</p>
          <div className="order-details">
            <p>Artist Fee: PKR 5000</p>
            <p>Service Fee: PKR 2000</p>
            <h4>Total Amount: <strong>PKR 8000</strong></h4>
          </div>

          <button className="pay-now-button" onClick={handlePaymentSubmit}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
