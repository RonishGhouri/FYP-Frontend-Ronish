import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Index from "./Components/Index/Index";
import { BookingsProvider } from "./Context/BookingsContext"; // Import the BookingsProvider
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BookingsProvider> {/* Wrap the Router with BookingsProvider */}
      <Router>
        <Index />
      </Router>
    </BookingsProvider>
  );
}

export default App;
