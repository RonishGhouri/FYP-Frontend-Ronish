import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import Home from "./Home/Home.jsx";
import Pricing from "./Pricing/Pricing.jsx";
import Title from "./Title/Title.jsx";
import Feature from "./Feature/Feature.jsx";
import Contact from "./Contact/Contact.jsx";
import Footer from "./Footer/Footer.jsx";
import Login from "../AuthenticationPages/LogIn/Login.jsx";
import SignUp from "../AuthenticationPages/SignUp/SignUp.jsx";  // Import the SignUp component
import ArtistWelcome from "../Artist/ArtistWelcome.jsx";
import CompanyWelcome from "../Company/CompanyWelcome.jsx";

function Index() {
  return (
    <div>
      <Navbar />
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
        <Route path="/login" element={<Login />} />  {/* Route for Login */}
        <Route path="/signup" element={<SignUp />} /> {/* Route for SignUp */}
        <Route path="/artist-welcome" element={<ArtistWelcome />} />
        <Route path="/company-welcome" element={<CompanyWelcome />} />
      </Routes>
    </div>
  );
}

export default Index;
