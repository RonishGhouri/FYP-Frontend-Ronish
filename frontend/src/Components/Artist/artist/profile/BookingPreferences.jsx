import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./BookingPreferences.css";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

const BookingPreferences = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [error, setError] = useState("");

  const [bookingPreferences, setBookingPreferences] = useState({
    notAvailable: {
      from: "",
      till: "",
    },
    chargesperevent: "",
    availability: true,
  });

  useEffect(() => {
    // Fetch booking preferences from Firestore
    const fetchBookingPreferences = async () => {
      if (!currentUser) return;
      setLoading(true);
      setLoadings(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBookingPreferences({
            ...bookingPreferences,
            ...data,
            notAvailable: {
              from: data?.notAvailable?.from || "",
              till: data?.notAvailable?.till || "",
            },
            chargesperevent: data?.chargesperevent || "",
          });
        } else {
          console.log("No booking preferences found!");
        }
      } catch (error) {
        console.error("Error fetching booking preferences:", error);
        setError("Failed to fetch booking preferences. Please try again.");
      } finally {
        setLoading(false);
        setLoadings(false);
      }
    };

    fetchBookingPreferences();
  }, [currentUser]);

  const handleBookingPreferencesChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("notAvailable.")) {
      const field = name.split(".")[1];
      setBookingPreferences((prev) => ({
        ...prev,
        notAvailable: {
          ...prev.notAvailable,
          [field]: value,
        },
      }));
    } else {
      setBookingPreferences((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoadings(true);

    try {
      const { notAvailable } = bookingPreferences;

      const updatedPreferences = {
        ...bookingPreferences,
        chargesperevent: `${bookingPreferences.chargesperevent
          .replace(/Rs/g, "")
          .trim()}`,
      };

      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, updatedPreferences, { merge: true });
      toast.success("Booking preferences updated successfully!");
    } catch (error) {
      console.error("Error saving booking preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    const checkAvailability = () => {
      const { from, till } = bookingPreferences.notAvailable;

      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
      });
      const todayDate = new Date(today).setHours(0, 0, 0, 0); // Reset time

      const fromDate = from ? new Date(from).setHours(0, 0, 0, 0) : null;
      const tillDate = till ? new Date(till).setHours(0, 0, 0, 0) : null;

      if (
        fromDate &&
        todayDate < fromDate // Today is before "From"
      ) {
        setBookingPreferences((prev) => ({
          ...prev,
          availability: true, // Available
        }));
      }
      if (
        tillDate &&
        todayDate > tillDate // Today is after "Till"
      ) {
        setBookingPreferences((prev) => ({
          ...prev,
          notAvailable: { from: "", till: "" },
          availability: true, // Available
        }));
      } else if (
        fromDate &&
        tillDate &&
        todayDate >= fromDate &&
        todayDate <= tillDate // Today is between "From" and "Till"
      ) {
        setBookingPreferences((prev) => ({
          ...prev,
          availability: false, // Not available
        }));
      } else {
        setBookingPreferences((prev) => ({
          ...prev,
          availability: true, // Default to available
        }));
      }
    };

    checkAvailability();
  }, [bookingPreferences.notAvailable]);

  // Disable all past dates using Pakistan timezone
  const getMinDate = () => {
    const today = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
    });
    const todayDate = new Date(today);
    return todayDate.toISOString().split("T")[0]; // Format as yyyy-mm-dd
  };

  return (
    <div className="profile-section">
      <h2>Booking Preferences</h2>
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loaderContainer}>
            <ThreeDot
              color="#212ea0" // Loader color
              size="small" // Loader size
            />
          </div>
        </div>
      )}
      <form onSubmit={handleSaveChanges}>
        {/* Not Available Duration */}
        <div className="form-section">
          <label>Not Available</label>
          <div className="availability-section">
            <label>From:</label>
            <input
              type="date"
              name="notAvailable.from"
              value={bookingPreferences.notAvailable.from}
              onChange={handleBookingPreferencesChange}
              className="form-input"
              min={getMinDate()} // Disable all dates before today
            />
            <label>Till:</label>
            <input
              type="date"
              name="notAvailable.till"
              value={bookingPreferences.notAvailable.till}
              onChange={handleBookingPreferencesChange}
              className="form-input"
              min={bookingPreferences.notAvailable.from || getMinDate()} // Disable all dates before "From"
            />
          </div>
        </div>

        {/* Rate Per Event */}
        <div className="form-section">
          <label>Charges Per Event (Rs)</label>
          <input
            type="text"
            name="chargesperevent"
            value={bookingPreferences.chargesperevent.replace(/Rs/g, "").trim()}
            onChange={handleBookingPreferencesChange}
            className="form-input"
            placeholder="Enter charges per event"
          />
        </div>

        {/* Save Button */}
        <div className="form-section">
          <button type="submit" className="save-button" disabled={loadings}>
            {loadings ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Grey transparent background
    zIndex: 9999, // Ensure the loader appears above everything else
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    padding: "20px 40px",
    borderRadius: "8px", // Rounded corners for the popup
  },
};

export default BookingPreferences;
