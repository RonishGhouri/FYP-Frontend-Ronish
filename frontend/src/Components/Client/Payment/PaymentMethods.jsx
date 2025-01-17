import React, { useState, useEffect } from "react";
import { FaTrash, FaStar, FaUniversity } from "react-icons/fa";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import "./paymentMethods.css";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountTitle: "",
    phoneNumber: "",
  });
  const [clientId, setClientId] = useState(null);

  // Fetch authenticated client ID
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setClientId(user.uid); // Set the authenticated client's UID
    } else {
      console.error("User not authenticated");
    }
  }, []);

  // Fetch payment methods from Firestore
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        if (!clientId) return;
        const docRef = doc(db, "paymentMethods", clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPaymentMethods(docSnap.data().methods || []);
        } else {
          setPaymentMethods([]);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, [clientId]);

  const paymentOptions = [
    {
      id: "jazzcash",
      name: "JazzCash",
      imgSrc:
        "https://seeklogo.com/images/J/jazz-cash-logo-829841352F-seeklogo.com.png",
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      imgSrc:
        "https://websol.biz/wp-content/uploads/2020/09/jazzcash_small-removebg-preview.png",
    },
    {
      id: "bank",
      name: "Bank Account",
      icon: <FaUniversity className="method-icon" />,
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setFormData({
      accountNumber: "",
      accountTitle: "",
      phoneNumber: "",
    });
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (!clientId) {
      console.error("Client ID is not available");
      return;
    }

    const newMethod = {
      type: selectedMethod,
      isDefault: paymentMethods.length === 0,
      ...formData,
    };

    try {
      const docRef = doc(db, "paymentMethods", clientId);
      const docSnap = await getDoc(docRef);

      const updatedMethods = docSnap.exists()
        ? [...docSnap.data().methods, newMethod]
        : [newMethod];

      await setDoc(docRef, { methods: updatedMethods }, { merge: true });
      setPaymentMethods(updatedMethods);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding payment method:", error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.type === id,
      }));

      const docRef = doc(db, "paymentMethods", clientId);
      await updateDoc(docRef, { methods: updatedMethods });
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error("Error setting default method:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedMethods = paymentMethods.filter((method) => method.type !== id);
      const docRef = doc(db, "paymentMethods", clientId);

      await updateDoc(docRef, { methods: updatedMethods });
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  const resetForm = () => {
    setSelectedMethod("");
    setFormData({
      accountNumber: "",
      accountTitle: "",
      phoneNumber: "",
    });
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => {
      if (!prev) {
        resetForm(); // Reset form when opening the form
      }
      return !prev;
    });
  };

  const getIcon = (type) => {
    const paymentOption = paymentOptions.find((opt) => opt.id === type);
    if (paymentOption.imgSrc) {
      return (
        <img
          src={paymentOption.imgSrc}
          alt={paymentOption.name}
          className="method-image"
        />
      );
    }
    return paymentOption.icon;
  };

  const getMethodDetails = (method) => {
    switch (method.type) {
      case "jazzcash":
      case "easypaisa":
        return (
          <>
            <p>{method.accountTitle}</p>
            <p>Phone: {method.phoneNumber}</p>
          </>
        );
      case "bank":
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
    <div className="payment-methods">
      <div className="methods-header">
        <h2>Payment Methods</h2>
        <button className="add-method-btn" onClick={toggleAddForm}>
          {showAddForm ? "Close" : "Add New Method"}
        </button>
      </div>

      {/* List of Added Payment Methods */}
      <div className="methods-list">
        {paymentMethods.map((method) => (
          <div key={method.type} className="method-card">
            <div className="card-info">
              {getIcon(method.type)}
              <div className="card-details">
                <h3>
                  {paymentOptions.find((opt) => opt.id === method.type)?.name}
                </h3>
                {getMethodDetails(method)}
              </div>
            </div>
            <div className="card-actions">
              {method.isDefault && (
                <span className="default-badge">
                  <FaStar /> Default
                </span>
              )}
              {!method.isDefault && (
                <button
                  className="set-default-btn"
                  onClick={() => handleSetDefault(method.type)}
                >
                  Set Default
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDelete(method.type)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Payment Method */}
      {showAddForm && (
        <div className="add-method-form">
          <h3>Add New Payment Method</h3>
          {!selectedMethod ? (
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  className="payment-option-btn"
                  onClick={() => handleMethodSelect(option.id)}
                  disabled={paymentMethods.some(
                    (method) => method.type === option.id
                  )} // Disable if already added
                >
                  {getIcon(option.id)}
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleAddMethod}>
              <h4>
                {paymentOptions.find((opt) => opt.id === selectedMethod)?.name}
              </h4>
              {selectedMethod === "bank" ? (
                <>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Title</label>
                    <input
                      type="text"
                      value={formData.accountTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountTitle: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Title</label>
                    <input
                      type="text"
                      value={formData.accountTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountTitle: e.target.value,
                        })
                      }
                      placeholder="Enter account title"
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add Method
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={toggleAddForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
