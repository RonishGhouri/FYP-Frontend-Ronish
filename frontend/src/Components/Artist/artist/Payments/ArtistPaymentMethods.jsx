import React, { useState } from 'react';
import { FaTrash, FaStar, FaUniversity } from 'react-icons/fa';
import './artistPaymentMethods.css';

const ArtistPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountTitle: '',
    phoneNumber: ''
  });

  // Payment options for selection
  const paymentOptions = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      imgSrc: 'https://seeklogo.com/images/J/jazz-cash-logo-829841352F-seeklogo.com.png'
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      imgSrc: 'https://websol.biz/wp-content/uploads/2020/09/jazzcash_small-removebg-preview.png'
    },
    {
      id: 'bank',
      name: 'Bank Account',
      icon: <FaUniversity className="method-icon" />
    }
  ];

  // Select payment method
  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setFormData({
      accountNumber: '',
      accountTitle: '',
      phoneNumber: ''
    });
  };

  // Add payment method
  const handleAddMethod = (e) => {
    e.preventDefault();
    const newMethod = {
      id: Date.now(),
      type: selectedMethod,
      isDefault: paymentMethods.length === 0, // First method is default
      ...formData
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddForm(false);
    resetForm();
  };

  // Set default payment method
  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  // Delete payment method
  const handleDelete = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setSelectedMethod('');
    setFormData({
      accountNumber: '',
      accountTitle: '',
      phoneNumber: ''
    });
  };

  // Toggle add form visibility
  const toggleAddForm = () => {
    setShowAddForm((prev) => {
      if (!prev) resetForm();
      return !prev;
    });
  };

  // Get method icon or image
  const getIcon = (type) => {
    const paymentOption = paymentOptions.find(opt => opt.id === type);
    if (paymentOption.imgSrc) {
      return <img src={paymentOption.imgSrc} alt={paymentOption.name} className="method-image" />;
    }
    return paymentOption.icon;
  };

  // Display method details
  const getMethodDetails = (method) => {
    switch (method.type) {
      case 'jazzcash':
      case 'easypaisa':
        return (
          <>
            <p>{method.accountTitle}</p>
            <p>Phone: {method.phoneNumber}</p>
          </>
        );
      case 'bank':
        return (
          <>
            <p>{method.accountTitle}</p>
            <p>Account: {method.accountNumber}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="artist-payment-methods">
      <div className="methods-header">
        <h2>Payment Methods</h2>
        <button
          className="add-method-btn"
          onClick={toggleAddForm}
        >
          {showAddForm ? 'Close' : 'Add New Method'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-method-form">
          <h3>Add New Payment Method</h3>
          {!selectedMethod ? (
            <div className="payment-options">
              {paymentOptions.map(option => (
                <button
                  key={option.id}
                  className="payment-option-btn"
                  onClick={() => handleMethodSelect(option.id)}
                >
                  {getIcon(option.id)}
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleAddMethod}>
              <h4>{paymentOptions.find(opt => opt.id === selectedMethod)?.name}</h4>
              {selectedMethod === 'bank' ? (
                <>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Title</label>
                    <input
                      type="text"
                      value={formData.accountTitle}
                      onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                      placeholder="Enter account title"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Title</label>
                    <input
                      type="text"
                      value={formData.accountTitle}
                      onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                      placeholder="Enter account title"
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="submit-btn">Add Method</button>
                <button type="button" className="cancel-btn" onClick={toggleAddForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="methods-list">
        {paymentMethods.map(method => (
          <div key={method.id} className="method-card">
            <div className="card-info">
              {getIcon(method.type)}
              <div className="card-details">
                <h3>{method.type}</h3>
                {getMethodDetails(method)}
              </div>
            </div>
            <div className="card-actions">
              {method.isDefault && <span className="default-badge"><FaStar /> Default</span>}
              {!method.isDefault && <button className='artist-set-default-btn' onClick={() => handleSetDefault(method.id)}>Set Default</button>}
              <button className="artist-delete-btn" onClick={() => handleDelete(method.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPaymentMethods;
