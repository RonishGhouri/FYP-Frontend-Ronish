import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PaymentPopup.css";

const PaymentPopup = ({ booking, onClose }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [detailValue, setDetailValue] = useState("");
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!uid) return;

      try {
        const docRef = doc(db, "paymentMethods", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPaymentMethods(docSnap.data().methods || []);
        } else {
          console.error("No payment methods found for this user.");
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, [uid]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method.type);
    setDetailValue(
      method.type === "easypaisa" || method.type === "jazzcash"
        ? method.phoneNumber
        : method.accountNumber
    );
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod || !detailValue) {
      toast.error(
        "Please select a payment method and provide the required details."
      );
      return;
    }

    try {
      // Retrieve current user's totalSpent value
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      let currentTotalSpent = userDoc.data()?.totalSpent || 0; // Default to 0 if not present

      // Calculate new totalSpent
      const updatedTotalSpent = currentTotalSpent + booking.grandTotal;

      // Update user's totalSpent in the database
      await updateDoc(userRef, {
        totalSpent: updatedTotalSpent,
      });

      // Prepare the payment data
      const paymentData = {
        paymentDone: true,
        grandTotal: booking.grandTotal,
        artistCharges: booking.artistCharges,
        paymentMethod: selectedPaymentMethod,
        eventStartDate: booking.eventStartDate,
        artistId: booking.artistId,
        clientId: uid,
        createdAt: new Date().toISOString(),
      };

      // Add payment data to Firestore
      await addDoc(collection(db, "payments"), paymentData);

      // Update booking status to 'Completed' in Firestore
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: "Completed",
        paid: true,
      });

      // Determine the event status based on the current date
      const currentDate = new Date();
      const eventStartDate = new Date(booking.eventStartDate);

      let eventStatus = "Upcoming"; // Default to Upcoming
      if (eventStartDate.getTime() === currentDate.getTime()) {
        eventStatus = "Present";
      }

      // Create Event in Firestore and capture the eventId
      const eventRef = await addDoc(collection(db, "events"), {
        artistName: booking.artistName || "Unknown Artist",
        bookingId: booking.id,
        createdAt: new Date().toISOString(),
        eventDetails: booking.eventDetails || "No Details",
        eventStartDate: booking.eventStartDate || "No Start Date",
        eventStartTime: booking.eventTime || "No Time",
        eventType: booking.eventType || "No Type",
        venue: booking.location || "No Location",
        cost: booking.grandTotal || 0,
        artistCharges: booking.artistCharges || 0,
        artistProfilePicture: booking.artistProfilePicture || "",
        clientProfilePicture: booking.clientProfilePicture || "",
        clientName: booking.clientName || "Unknown Client",
        clientId: booking.clientId,
        artistId: booking.artistId || "Unknown Artist ID",
        bookingStatus: "Complete",
        status: eventStatus, // Set the status dynamically
      });

      const eventId = eventRef.id; // Capture the eventId

      // Send two notifications to the artist
      const notificationsRef = collection(db, "notifications");

      // Notification 1: Booking Completed
      await addDoc(notificationsRef, {
        recipientId: booking.artistId, // Artist ID
        message: `The booking for ${booking.eventDetails} has been marked as Completed.`,
        type: "booking_completed",
        bookingId: booking.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      // Notification 2: Event Created
      await addDoc(notificationsRef, {
        recipientId: booking.artistId, // Artist ID
        message: `A new event for ${booking.eventDetails} has been created.`,
        type: "event_created",
        eventId: eventId, // Use the correct eventId
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      toast.success(
        "Payment successful! Event created, and booking marked as Completed."
      );
      onClose();
    } catch (error) {
      console.error(
        "Error processing payment or sending notifications:",
        error
      );
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-popup-overlay" onClick={onClose}>
      <div
        className="payment-popup-horizontal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-methods-section">
          <h3 className="section-title">Select Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map((method, index) => (
              <button
                key={index}
                className={`payment-method ${
                  selectedPaymentMethod === method.type ? "active" : ""
                }`}
                onClick={() => handlePaymentMethodSelect(method)}
              >
                <img
                  src={
                    method.type === "jazzcash"
                      ? "https://seeklogo.com/images/J/jazz-cash-logo-829841352F-seeklogo.com.png"
                      : method.type === "easypaisa"
                      ? "https://websol.biz/wp-content/uploads/2020/09/jazzcash_small-removebg-preview.png"
                      : "https://img.favpng.com/9/20/1/online-banking-logo-organization-clip-art-png-favpng-U3WiXXaBFvJuipxBfZ9camEjB.jpg"
                  }
                  alt={method.type}
                  className="payment-logo"
                />
                {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
              </button>
            ))}
          </div>

          {selectedPaymentMethod && (
            <div className="payment-details">
              <p>
                {selectedPaymentMethod === "easypaisa" ||
                selectedPaymentMethod === "jazzcash"
                  ? "Phone Number"
                  : "Account Number"}{" "}
                for {selectedPaymentMethod}:
              </p>
              <input type="text" readOnly value={detailValue} />
              <p className="note">
                Ensure your {selectedPaymentMethod} account has sufficient
                balance.
              </p>
            </div>
          )}
        </div>

        <div className="order-summary-section">
          <h3 className="section-title">Booking Summary</h3>
          <p>
            <strong>Event Name:</strong> {booking.eventDetails}
          </p>
          <p>
            <strong>Category:</strong> {booking.eventType}
          </p>
          <p>
            <strong>Event Start Date:</strong> {booking.eventStartDate}
          </p>
          <p>
            <strong>Venue:</strong> {booking.location}
          </p>
          <div className="order-details">
            <p>Your Charges: Rs. {booking.artistCharges}</p>
            <p>Platform Fees: Rs. {booking.serviceCharges}</p>
            <h4>
              Grand Total: <strong> Rs. {booking.grandTotal}</strong>
            </h4>
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
