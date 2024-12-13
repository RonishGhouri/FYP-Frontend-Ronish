import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../AuthNavbar/AuthNavbar";
import { auth, db } from "../../firebaseConfig"; // Import Firebase Authentication and Firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state before processing the form

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        console.log(userRole);
        setRole(userRole); // Set role from Firestore

        // Navigate based on the user's role
        if (userRole === "artist") {
          console.log("Navigating to artist...");
          setTimeout(() => {
            navigate('/artist/');
          }, 500);
        } else if (userRole === "client") {
          console.log("Navigating to client...");
          setTimeout(() => {
            navigate("/client/");
          }, 500);
        }
      } else {
        setError("User data not found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Log In</h2>
        <p className="subheading">Welcome back! Please log in to continue.</p>

        {/* Display error message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Display role if user is authenticated */}
        {role && (
          <p className="role-msg">
            You are logged in as: <strong>{role}</strong>
          </p>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="auth-input"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="auth-input"
            autoComplete="current-password"
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
