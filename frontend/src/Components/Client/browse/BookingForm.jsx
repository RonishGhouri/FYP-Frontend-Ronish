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
    artistFee: initialData?.artistFee || artist.chargesperevent || 0, // Editable Artist Fee
  });

  const [clientProfilePicture, setClientProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [conflictingDates, setConflictingDates] = useState([]);
  const { addBooking } = useBookings();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        setFetchingData(true);
        try {
          const userRef = doc(db, "users", user.uid);
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
            );
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

        setUnavailableDates([...new Set(artistDates)]);
        setConflictingDates([...new Set(clientDates)]);
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
        bookingId,
        recipientId,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
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

    const twoDaysBeforeEventStart = new Date(sortedDates[0]);
    twoDaysBeforeEventStart.setDate(twoDaysBeforeEventStart.getDate() - 2);

    if (bookingId && new Date() > twoDaysBeforeEventStart) {
      toast.error(
        "You cannot edit the booking less than two days before the event's start date."
      );
      setLoading(false);
      return;
    }

    setLoading(true);

    const user = auth.currentUser;
    const formattedEventTime = formatTimeTo24Hour(formData.eventTime);

    const artistFee = parseInt(formData.artistFee); // Include updated artist fee
    const serviceCharges = Math.ceil(artistFee * 0.05);
    const grandTotal = artistFee + serviceCharges;

    let bookingData = {
      artistId: artist.id,
      artistName: artist.name,
      artistProfilePicture: artist.profilePicture,
      clientId: user.uid,
      clientName: formData.name,
      clientEmail: formData.email,
      clientProfilePicture: clientProfilePicture,
      eventDetails: formData.eventDetails,
      eventDates: sortedDates,
      eventStartDate: sortedDates[0] || null,
      eventTime: formattedEventTime,
      eventType:
        formData.eventType === "Other"
          ? formData.customEventType
          : formData.eventType,
      location: formData.location,
      artistCharges: artistFee,
      serviceCharges,
      grandTotal,
      status: "Pending",
      paid: false,
      approved: false,
      updatedAt: new Date(),
    };

    try {
      if (bookingId) {
        const bookingRef = doc(db, "bookings", bookingId);
        const bookingDoc = await getDoc(bookingRef);
        if (!bookingDoc.exists()) {
          setError("Booking not found.");
          setLoading(false);
          return;
        }

        await updateDoc(bookingRef, bookingData);
        await sendNotification(
          artist.id,
          `The booking for ${formData.eventDetails} has been updated.`,
          "info",
          bookingId
        );
        toast.success("Booking updated successfully.");
      } else {
        const bookingRef = await addDoc(
          collection(db, "bookings"),
          bookingData
        );
        addBooking({ ...bookingData, id: bookingRef.id });
        await sendNotification(
          artist.id,
          `You have a new booking request for ${formData.eventDetails}.`,
          "success"
        );
        toast.success(`Your booking request has been sent to ${artist.name}.`);
      }

      onClose();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(`Failed to submit booking. ${error.message}`);
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

  const safeInitialData = initialData || { eventDates: [] };

  const filteredUnavailableDates = unavailableDates.filter(
    (date) => !safeInitialData.eventDates.includes(date)
  );
  const serviceCharges = Math.ceil(formData.artistFee * 0.05); // Recalculate service charges
  const grandTotal = parseInt(formData.artistFee) + serviceCharges; // Recalculate grand total

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
                <label>Artist Fee (Per Event)</label>
                <input
                  type="number"
                  value={formData.artistFee}
                  onChange={(e) =>
                    setFormData({ ...formData, artistFee: e.target.value })
                  }
                  name="artistFee"
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <input
                  type="text"
                  name="eventType"
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({ ...formData, eventType: e.target.value })
                  }
                  placeholder="Enter Event Type (e.g., Wedding, Birthday)"
                  required
                />
              </div>

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
                    value={formData.eventDates.map((date) => new Date(date))}
                    minDate={
                      bookingId ? new Date(Date.now()) : new Date(Date.now())
                    }
                    onChange={handleDateChange}
                    mapDays={({ date }) => {
                      const jsDate =
                        date instanceof Date ? date : new Date(date);
                      const formattedDate = jsDate.toLocaleDateString("en-CA");

                      if (bookingId) {
                        if (formData.eventDates.includes(formattedDate)) {
                          return {
                            style: {
                              backgroundColor: "lightgreen",
                              border: "2px solid green",
                            },
                            title: "Click to deselect or reselect this date.",
                          };
                        }

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
              <strong>Artist Fee (Per Event):</strong> Rs. {formData.artistFee}
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
              <strong>Event Start Date:</strong>{" "}
              {formData.eventDates.length
                ? formData.eventDates[0]
                : "Not selected yet"}
            </p>
            <p>
              <strong>Event Starting Time:</strong>{" "}
              {formData.eventTime
                ? formatTimeTo12Hour(formData.eventTime)
                : "Not selected yet"}
            </p>
            <hr />
            <p>
              <strong>Total Event Cost (TEC):</strong> Rs. {formData.artistFee}
            </p>
            <p>
              <strong>Platform Fees (5% of TEC):</strong> Rs. {serviceCharges}
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
};

export default BookingForm;
