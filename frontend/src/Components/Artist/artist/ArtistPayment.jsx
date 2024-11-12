import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./ArtistPayment.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ArtistSidebar from "./sidebar/ArtistSidebar";
import ArtistHeader from "./header/ArtistHeader";

ChartJS.register(ArcElement, Tooltip, Legend);

const ArtistPayment = () => {
  const [hasPaymentDetails, setHasPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    bank: "",
    accountName: "",
    accountNumber: "",
    mobileNumber: "",
    method: "",
  });
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, amount: 500, date: "2024-01-10", method: "Bank", status: "Held by Admin" },
    { id: 2, amount: 300, date: "2024-02-14", method: "JazzCash", status: "Pending" },
    { id: 3, amount: 120, date: "2024-03-20", method: "Easypaisa", status: "Completed" },
  ]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [banks, setBanks] = useState([
    { name: "HBL", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/HBL.png" },
    { name: "UBL", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/UBL.png" },
    {
      name: "Meezan Bank",
      logo: "https://upload.wikimedia.org/wikipedia/en/9/9d/Meezan_Bank_logo.svg",
    },
    {
      name: "Bank Alfalah",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Bank_Alfalah_logo.png",
    },
    { name: "MCB", logo: "https://upload.wikimedia.org/wikipedia/en/2/27/MCB.png" },
    { name: "Faysal Bank", logo: "https://upload.wikimedia.org/wikipedia/en/f/fc/Faysal_Bank.png" },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedPaymentDetails = localStorage.getItem("hasPaymentDetails");

    if (storedPaymentDetails === "true") {
      setHasPaymentDetails(true);
    }
  }, []);

  

  const handlePaymentMethodChange = (e) => {
    setSelectedMethod(e.target.value);
    setPaymentDetails({ ...paymentDetails, method: e.target.value });
  };

  const handlePaymentDetailsSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("hasPaymentDetails", "true");
    setHasPaymentDetails(true);
  };

  const totalEarnings = paymentHistory.reduce((sum, payment) => {
    return payment.status === "Completed" ? sum + payment.amount : sum;
  }, 0);

  const pendingPayments = paymentHistory.filter(
    (payment) => payment.status === "Pending"
  ).length;



  const generateInvoice = (payment) => {
    const doc = new jsPDF();
    doc.text("Payment Invoice", 20, 20);
    doc.autoTable({
      head: [["ID", "Amount", "Date", "Method", "Status"]],
      body: [
        [payment.id, `$${payment.amount}`, payment.date, payment.method, payment.status],
      ],
    });
    doc.save(`invoice_${payment.id}.pdf`);
  };

  const markEventAsComplete = (paymentId) => {
    setPaymentHistory((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "Completed" } : payment
      )
    );
  };

  if (!hasPaymentDetails) {
    return (
      <div className="artist-dashboard">
        <ArtistSidebar/>

        <div className="artist-main-dashboard">
        <ArtistHeader/>
          
          <div className="add-payment-method">
            <h4>Please Add Your Payment Details</h4>
            <form onSubmit={handlePaymentDetailsSubmit}>
              <label>Select Payment Method:</label>
              <select
                value={selectedMethod}
                onChange={handlePaymentMethodChange}
                required
              >
                <option value="">Select a Payment Method</option>
                <option value="Bank">Bank Transfer</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Easypaisa">Easypaisa</option>
              </select>

              {selectedMethod === "Bank" && (
                <>
                  <label>Select Bank:</label>
                  <select
                    value={paymentDetails.bank}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, bank: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a Bank</option>
                    {banks.map((bank, index) => (
                      <option key={index} value={bank.name}>
                        <img src={bank.logo} alt={bank.name} className="bank-logo" />{" "}
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={paymentDetails.accountName}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        accountName: e.target.value,
                      })
                    }
                    placeholder="Account Holder's Name"
                    required
                  />
                  <input
                    type="text"
                    value={paymentDetails.accountNumber}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Account Number"
                    required
                  />
                </>
              )}

              {(selectedMethod === "JazzCash" || selectedMethod === "Easypaisa") && (
                <>
                  <img
                    src={
                      selectedMethod === "JazzCash"
                        ? "https://seeklogo.com/images/J/jazzcash-logo-933D11A6D0-seeklogo.com.png"
                        : "https://www.easypaisa.com.pk/wp-content/uploads/2021/01/logo.png"
                    }
                    alt={selectedMethod}
                    className="method-logo"
                  />
                  <input
                    type="text"
                    value={paymentDetails.mobileNumber}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        mobileNumber: e.target.value,
                      })
                    }
                    placeholder="Registered Mobile Number"
                    required
                  />
                </>
              )}

              <button type="submit">Submit Payment Details</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-dashboard">
      {/* Sidebar */}
      <ArtistSidebar/>

      {/* Main Dashboard Content */}
      <div className="artist-main-dashboard">
      <ArtistHeader/>
        {/* Payment Dashboard */}
        <div className="artist-payment-dashboard">
          <h3>Earnings Overview</h3>
          <div>Total Earnings: ${totalEarnings}</div>
          <div>Pending Payments: {pendingPayments}</div>

          {/* Payment History */}
          <div className="artist-payment-section">
            <h3>Payment History</h3>
            <table className="artist-payment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Invoice</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.date}</td>
                    <td>{payment.method}</td>
                    <td className={`payment-status-${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </td>
                    <td>
                      {payment.status === "Completed" && (
                        <button onClick={() => generateInvoice(payment)}>Invoice</button>
                      )}
                    </td>
                    <td>
                      {payment.status === "Held by Admin" && (
                        <button onClick={() => markEventAsComplete(payment.id)}>
                          Mark as Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Payment Methods */}
        <div className="manage-payment-methods">
          <h4>Manage Payment Methods</h4>
          <form onSubmit={handlePaymentDetailsSubmit}>
            <label>Select Payment Method:</label>
            <select
              value={selectedMethod}
              onChange={handlePaymentMethodChange}
              required
            >
              <option value="">Select a Payment Method</option>
              <option value="Bank">Bank Transfer</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Easypaisa">Easypaisa</option>
            </select>

            {selectedMethod === "Bank" && (
              <>
                <label>Select Bank:</label>
                <select
                  value={paymentDetails.bank}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, bank: e.target.value })
                  }
                  required
                >
                  <option value="">Select a Bank</option>
                  {banks.map((bank, index) => (
                    <option key={index} value={bank.name}>
                      <img src={bank.logo} alt={bank.name} className="bank-logo" />{" "}
                      {bank.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={paymentDetails.accountName}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      accountName: e.target.value,
                    })
                  }
                  placeholder="Account Holder's Name"
                  required
                />
                <input
                  type="text"
                  value={paymentDetails.accountNumber}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      accountNumber: e.target.value,
                    })
                  }
                  placeholder="Account Number"
                  required
                />
              </>
            )}

            {(selectedMethod === "JazzCash" || selectedMethod === "Easypaisa") && (
              <>
                <img
                  src={
                    selectedMethod === "JazzCash"
                      ? "https://seeklogo.com/images/J/jazzcash-logo-933D11A6D0-seeklogo.com.png"
                      : "https://www.easypaisa.com.pk/wp-content/uploads/2021/01/logo.png"
                  }
                  alt={selectedMethod}
                  className="method-logo"
                />
                <input
                  type="text"
                  value={paymentDetails.mobileNumber}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      mobileNumber: e.target.value,
                    })
                  }
                  placeholder="Registered Mobile Number"
                  required
                />
              </>
            )}

            <button type="submit">Add/Update Payment Method</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistPayment;
