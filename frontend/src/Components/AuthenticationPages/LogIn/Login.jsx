import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../AuthNavbar/AuthNavbar";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        setRole(userRole);

        // Success notification
        toast.success("Login successful!");

        // Redirect user based on role
        setTimeout(() => {
          navigate(userRole === "artist" ? "/artist/" : "/client/");
        }, 1000);
      } else {
        toast.error("User data not found in the database.");
      }
    } catch (error) {
      // Firebase Error Mapping
      let errorMessage = "An unexpected error occurred. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many login attempts. Please try again later.";
          break;
        default:
          errorMessage = "Something went wrong. Please check your credentials.";
      }

      toast.error(errorMessage);
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
            disabled={loading} // Disable input during loading
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="auth-input"
            autoComplete="current-password"
            disabled={loading} // Disable input during loading
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
