import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Index from "./Components/Index/Index";
import { BookingsProvider } from "./Context/BookingsContext"; // Import the BookingsProvider
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BookingsProvider> {/* Wrap the Router with BookingsProvider */}
      <Router>
        <Index />
        {/* ToastContainer added here */}
        <ToastContainer position="top-center" autoClose={1000}/>
      </Router>
    </BookingsProvider>
  );
}

export default App;
