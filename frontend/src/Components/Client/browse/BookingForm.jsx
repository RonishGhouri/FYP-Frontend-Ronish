import React, { useState, useEffect } from "react";
import { useBookings } from "../../../Context/BookingsContext";
import { db, auth } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";
import "./BookingForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-multi-date-picker";
import { FaCalendarAlt } from "react-icons/fa";

const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const period = +hour >= 12 ? "P.M." : "A.M.";
  const formattedHour = +hour % 12 || 12;
  return `${formattedHour}:${minute} ${period}`;
};

const formatTimeTo24Hour = (time) => {
  if (!time) return "";
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  if (modifier === "P.M." && +hours !== 12) {
    hours = +hours + 12;
  }
  if (modifier === "A.M." && +hours === 12) {
    hours = "00";
  }
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

function BookingForm({ artist, onClose, bookingId, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    eventDetails: initialData?.eventDetails || "",
    eventDates: initialData?.eventDates || [],
    eventTime: initialData?.eventTime || "",
    eventType: initialData?.eventType || "",
    customEventType: initialData?.customEventType || "",
    location: initialData?.location || "",
  });

  const [clientProfilePicture, setClientProfilePicture] = useState(null); // State for the client's profile picture
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [conflictingDates, setConflictingDates] = useState([]);
  const { addBooking } = useBookings();

  const artistFee = parseInt(artist.chargesperevent) || 0;
  const totalCost = artistFee * formData.eventDates.length;

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        setFetchingData(true);
        try {
          const userRef = doc(db, "users", user.uid); // Firestore reference
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData((prevData) => ({
              ...prevData,
              name: userData.name || prevData.name,
              email: userData.email || prevData.email,
              location: userData.location || prevData.location,
            }));
            setClientProfilePicture(
              userData.profilePicture || "default-avatar.png"
            ); // Set profile picture
          } else {
            console.error("No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setFetchingData(false);
        }
      }
    };

    fetchUserData();
  }, [initialData]);
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const snapshot = await getDocs(bookingsRef);

        const artistDates = [];
        const clientDates = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.artistId === artist.id && data.eventDates) {
            artistDates.push(
              ...data.eventDates.map((date) =>
                new Date(date).toLocaleDateString("en-CA")
              )
            );
          }
          if (data.clientId === auth.currentUser?.uid && data.eventDates) {
            clientDates.push(
              ...data.eventDates.map((date) =>
                new Date(date).toLocaleDateString("en-CA")
              )
            );
          }
        });

        setUnavailableDates([...new Set(artistDates)]); // Ensure unique dates
        setConflictingDates([...new Set(clientDates)]); // Ensure unique dates
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();
  }, [artist.id]);

  const validateForm = () => {
    const { eventDetails, eventDates, eventTime, location, eventType } =
      formData;

    if (
      !eventDetails ||
      !eventDates.length ||
      !eventTime ||
      !location ||
      !eventType
    ) {
      toast.error(
        "All fields are required, and at least one date must be selected."
      );
      return false;
    }
    setError("");
    return true;
  };

  const sendNotification = async (
    recipientId,
    message,
    type,
    bookingId = null
  ) => {
    try {
      await addDoc(collection(db, "notifications"), {
        bookingId, // Optional Booking ID
        recipientId, // Dynamic recipient ID
        message, // Notification message
        type, // Notification type (e.g., success, info, warning, error)
        isRead: false, // Unread by default
        createdAt: new Date().toISOString(), // Timestamp
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const sortedDates = [...formData.eventDates].sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const eventStartDate = sortedDates.length ? new Date(sortedDates[0]) : null;

    const twoDaysBeforeEventStart = new Date(eventStartDate);
    twoDaysBeforeEventStart.setDate(twoDaysBeforeEventStart.getDate() - 2);

    if (bookingId && new Date() > twoDaysBeforeEventStart) {
      setError(
        "You cannot edit the booking less than two days before the event's start date."
      );
      setLoading(false);
      return;
    }

    setLoading(true);

    const user = auth.currentUser;

    const formattedEventTime = formatTimeTo24Hour(formData.eventTime);

    const bookingData = {
      artistId: artist.id,
      artistName: artist.name,
      artistProfilePicture: artist.profilePicture,
      clientId: user.uid,
      clientName: formData.name,
      clientEmail: formData.email,
      clientProfilePicture: clientProfilePicture,
      eventDetails: formData.eventDetails,
      eventDates: sortedDates,
      eventDaysCount: sortedDates.length,
      eventStartDate: sortedDates.length > 0 ? sortedDates[0] : null,
      eventEndDate:
        sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
      eventTime: formattedEventTime,
      eventType:
        formData.eventType === "Other"
          ? formData.customEventType
          : formData.eventType,
      location: formData.location,
      artistCharges: artistFee,
      totalCost,
      grandTotal,
      status: "Pending",
      paid: false,
      approved: false,
      createdAt: new Date(),
    };

    try {
      if (bookingId) {
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, bookingData);

        // Send a notification to the artist about the booking update
        await sendNotification(
          artist.id, // Artist ID
          `The booking for ${formData.eventDetails} has been updated by ${formData.name}.`,
          "info",
          bookingId
        );

        toast.success("Booking updated successfully.");
      } else {
        const bookingRef = await addDoc(
          collection(db, "bookings"),
          bookingData
        );

        const newBookingId = bookingRef.id;

        addBooking({ ...bookingData, id: newBookingId });

        // Send a notification to the artist about the new booking
        await sendNotification(
          artist.id, // Artist ID
          `You have a new booking request for ${formData.eventDetails} from ${formData.name}.`,
          "success",
          newBookingId
        );

        toast.success(`Your booking request has been sent to ${artist.name}.`);
      }

      onClose();
    } catch (error) {
      setError(`Failed to book ${artist.name}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => {
      if (date instanceof Date) return date.toLocaleDateString("en-CA");
      if (typeof date === "string") return date;
      if (date.toDate) return date.toDate().toLocaleDateString("en-CA");
      return null;
    });

    setFormData((prevData) => ({
      ...prevData,
      eventDates: formattedDates,
    }));
  };

  const eventStartDate = formData.eventDates.length
    ? formData.eventDates[0]
    : "Not selected yet";
  const eventEndDate = formData.eventDates.length
    ? formData.eventDates[formData.eventDates.length - 1]
    : "Not selected yet";
  const eventDaysCount = formData.eventDates.length;

  const serviceChargeRate = 0.05; // 5% service charge
  const serviceCharges = Math.ceil(totalCost * serviceChargeRate); // Calculate service charges
  const grandTotal = totalCost + serviceCharges; // Calculate grand total (artist fees + service charges)

  const safeInitialData = initialData || { eventDates: [] }; // Default fallback

  const filteredUnavailableDates = unavailableDates.filter(
    (date) => !safeInitialData.eventDates.includes(date)
  );

  return (
    <div className="booking-form-overlay">
      {fetchingData && (
        <div style={styles.overlay}>
          <div style={styles.loaderContainer}>
            <ThreeDot color="#212ea0" size="small" />
          </div>
        </div>
      )}
      <div className="booking-form-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="booking-form-container">
          <div className="booking-form-left">
            <h2>{bookingId ? "Edit Booking" : "New Booking"}</h2>
            <p>Artist: {artist.name}</p>
            <form>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  name="name"
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  name="email"
                  placeholder="Your email address"
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({ ...formData, eventType: e.target.value })
                  }
                  required
                >
                  <option value="">Select Event Type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Concert">Concert</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {formData.eventType === "Other" && (
                <div className="form-group">
                  <label>Custom Event Type</label>
                  <input
                    type="text"
                    value={formData.customEventType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customEventType: e.target.value,
                      })
                    }
                    placeholder="Specify Event Type"
                  />
                </div>
              )}
              <div className="form-group">
                <label>Event Details</label>
                <textarea
                  value={formData.eventDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDetails: e.target.value })
                  }
                  name="eventDetails"
                  placeholder="e.g., Birthday Party with live band."
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Dates</label>
                <div className="styled-calendar-input">
                  <Calendar
                    multiple
                    value={formData.eventDates.map((date) => new Date(date))} // Prefill selected dates
                    minDate={
                      bookingId
                        ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Allow future dates
                        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Two days from today
                    }
                    onChange={handleDateChange} // Handles changes properly
                    mapDays={({ date }) => {
                      const jsDate =
                        date instanceof Date ? date : new Date(date);
                      const formattedDate = jsDate.toLocaleDateString("en-CA");

                      // For editing existing bookings
                      if (bookingId) {
                        // Enable fetched dates even if they are unavailable
                        if (formData.eventDates.includes(formattedDate)) {
                          return {
                            style: {
                              backgroundColor: "lightgreen",
                              border: "2px solid green",
                            },
                            title: "Click to deselect or reselect this date.",
                          };
                        }

                        // Allow future dates for selection
                        if (
                          jsDate >= new Date() &&
                          !filteredUnavailableDates.includes(formattedDate)
                        ) {
                          return {
                            style: {
                              backgroundColor: "#e6ffe6",
                            },
                            title: "You can select this future date.",
                          };
                        }

                        // Disable other unavailable dates
                        if (
                          filteredUnavailableDates.includes(formattedDate) &&
                          !formData.eventDates.includes(formattedDate)
                        ) {
                          return {
                            disabled: true,
                            style: { backgroundColor: "red" },
                            title: `${artist.name} is already booked on this date.`,
                          };
                        }
                      } else {
                        // For new bookings
                        if (unavailableDates.includes(formattedDate)) {
                          return {
                            disabled: true,
                            style: { backgroundColor: "red" },
                            title: `${artist.name} is already booked on this date.`,
                          };
                        }
                        if (conflictingDates.includes(formattedDate)) {
                          return {
                            disabled: true,
                            style: { backgroundColor: "yellow" },
                            title: `You have booked other artists on these dates.`,
                          };
                        }
                      }

                      return {};
                    }}
                  />

                  <FaCalendarAlt className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Event Starting Time</label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTime: e.target.value })
                  }
                  name="eventTime"
                  required
                />
              </div>
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  name="location"
                  placeholder="e.g., 25-B, Gulberg III, Lahore"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
          <div className="booking-form-right">
            <h3>Booking Summary</h3>
            <p>
              <strong>Artist:</strong> {artist.name}
            </p>
            <p>
              <strong>Artist Fee (Per Event):</strong> Rs. {artistFee}
            </p>
            <hr />
            <p>
              <strong>Event Type:</strong>{" "}
              {formData.eventType === "Other"
                ? formData.customEventType
                : formData.eventType || "Not selected yet"}
            </p>
            <p>
              <strong>Event Details:</strong>{" "}
              {formData.eventDetails || "Not provided yet"}
            </p>
            <p>
              <strong>Venue:</strong> {formData.location}
            </p>
            <p>
              <strong>Event duration (in days):</strong> {eventDaysCount}
            </p>
            <p>
              <strong>Event Start Date:</strong> {eventStartDate}
            </p>
            <p>
              <strong>Event End Date:</strong> {eventEndDate}
            </p>
            <p>
              <strong>Event Starting Time:</strong>{" "}
              {formData.eventTime
                ? formatTimeTo12Hour(formData.eventTime)
                : "Not selected yet"}
            </p>
            <hr />
            <p>
              <strong>Total Event Cost (TEC):</strong> Rs. {totalCost}
            </p>
            <p>
              <strong>Service Charges (5% of TEC):</strong> Rs. {serviceCharges}
            </p>
            <p>
              <strong>Grand Total:</strong> Rs. {grandTotal}
            </p>

            <button
              type="submit"
              className="confirm-booking-btn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Submitting..."
                : bookingId
                ? "Update Booking"
                : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 9999,
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
    borderRadius: "8px",
  },
  "calendar-icon": {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.2rem",
    color: "#555",
    cursor: "pointer",
  },
};

export default BookingForm;
