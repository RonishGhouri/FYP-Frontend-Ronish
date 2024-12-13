import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import Home from "./Home/Home.jsx";
import Pricing from "./Pricing/Pricing.jsx";
import Title from "./Title/Title.jsx";
import Feature from "./Feature/Feature.jsx";
import Contact from "./Contact/Contact.jsx";
import Footer from "./Footer/Footer.jsx";
import Login from "../AuthenticationPages/LogIn/Login.jsx";
import SignUp from "../AuthenticationPages/SignUp/SignUp.jsx";
import PasswordReset from "../AuthenticationPages/PasswordReset/PasswordReset.jsx";
import NewPassword from "../AuthenticationPages/NewPassword/NewPassword.jsx";
import ClientDashboard from "../Client/ClientDashboard.jsx";
import ClientProfile from "../Client/profile/ClientProfile.jsx";


import RequireAuth from "../AuthenticationPages/RequireAuth";

/* Import the newly created artist management components */
import ArtistDashboard from "../Artist/artist/ArtistDashboard.jsx";
import ArtistProfile from "../Artist/artist/profile/ArtistProfile.jsx";
import ArtistBookings from "../Artist/artist/ArtistBookings";
import ArtistEvents from "../Artist/artist/ArtistEvents";
import ArtistContent from "../Artist/artist/ArtistContent";
import ArtistPayment from "../Artist/artist/ArtistPayment";
import ArtistChat from "../Artist/artist/ArtistChat";
import ClientChat from "../Client/ClientChat.jsx";
import ClientBrowserArtist from "../Client/browse/ClientBrowserArtist.jsx";
import ClientEvent from "../Client/Events/ClientEvent.jsx";
import ClientBooking from "../Client/Bookings/ClientBooking.jsx";
import ClientPayment from "../Client/Payment/PaymentDashboard.jsx";

function Index() {
  const location = useLocation(); // Get the current path

  // Check if the current route starts with "/artist"
  const isArtistRoute = location.pathname.startsWith("/artist");

  const isClientRoute = location.pathname.startsWith("/client");

  return (
    <div>
      {/* Conditionally render Navbar only if not in artist-related routes */}
      {!isArtistRoute && !isClientRoute && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Home />
              <div className="container">
                <Title
                  subtitle="Our features"
                  title="Highlighting the Best of Our Offerings"
                />
                <Feature />
                <Title
                  subtitle="Pricing"
                  title="Finding the Right Fit for Your Budget"
                />
                <Pricing />
                <Title subtitle="Contact us" title="Get in touch" />
                <Contact />
              </div>
              <Footer />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/reset/:uidb64/:token" element={<NewPassword />} />

        {/* Artist-specific routes */}
        <Route
          path="/artist/"
          element={
            <RequireAuth>
              <ArtistDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/artist/profile"
          element={
            <RequireAuth>
              <ArtistProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/artist/bookings"
          element={
            <RequireAuth>
              <ArtistBookings />
            </RequireAuth>
          }
        />
        <Route
          path="/artist/events"
          element={
            <RequireAuth>
              <ArtistEvents />
            </RequireAuth>
          }
        />
        <Route
          path="/artist/content"
          element={
            <RequireAuth>
              <ArtistContent />
            </RequireAuth>
          }
        />

        <Route
          path="/artist/payment"
          element={
            <RequireAuth>
              <ArtistPayment />
            </RequireAuth>
          }
        />
        <Route
          path="/artist/chats"
          element={
            <RequireAuth>
              <ArtistChat />
            </RequireAuth>
          }
        />
        {/* Other role dashboards */}

        <Route
          path="/client/"
          element={
            <RequireAuth>
              <ClientDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/client/profile"
          element={
            <RequireAuth>
              <ClientProfile/>
            </RequireAuth>
          }
        />

        <Route
          path="/client/chats"
          element={
            <RequireAuth>
              <ClientChat />
            </RequireAuth>
          }
        />

        <Route
          path="/client/artists"
          element={
            <RequireAuth>
              <ClientBrowserArtist />
            </RequireAuth>
          }
        />

        <Route
          path="/client/events"
          element={
            <RequireAuth>
              <ClientEvent />
            </RequireAuth>
          }
        />

        <Route
          path="/client/bookings"
          element={
            <RequireAuth>
              <ClientBooking />
            </RequireAuth>
          }
        />

        <Route
          path="/client/payments"
          element={
            <RequireAuth>
              <ClientPayment/>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default Index;
