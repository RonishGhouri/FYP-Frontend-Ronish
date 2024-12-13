// src/context/BookingsContext.js
import React, { createContext, useState, useContext } from "react";

const BookingsContext = createContext();

export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    // Move your initialBookingsData here from ClientBooking.jsx
  ]);

  const addBooking = (newBooking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  return (
    <BookingsContext.Provider value={{ bookings, setBookings, addBooking }}>
      {children}
    </BookingsContext.Provider>
  );
};
