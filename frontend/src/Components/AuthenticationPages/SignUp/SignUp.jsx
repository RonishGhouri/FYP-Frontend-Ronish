import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../AuthNavbar/AuthNavbar";
import { auth, db } from "../../firebaseConfig"; // Firebase Authentication and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";

const SignUp = () => {
  const [name, setName] = useState(""); // Updated to use 'name'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to validate password format
  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic form validations
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must contain both uppercase and lowercase letters");
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Firebase user object

      // Store user data in Firestore "users" collection
      const userData = {
        name, // Updated to use 'name'
        email,
        role,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // If role is 'artist', initialize rating data in "ratings" collection
      if (role === "artist") {
        const ratingsData = {
          excellent: 0,
          average: 0,
          bad: 0,
          totalReviews: 0,
          overallRating: 0, // Placeholder for average rating calculation
          createdAt: new Date(),
        };

        // Store ratings data with the same UID as the user
        await setDoc(doc(db, "ratings", user.uid), ratingsData);
      }

      // Success notification
      toast.success("Signup successful! Redirecting to login...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Handle Firebase errors with user-friendly messages
      let errorMessage = "An error occurred. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please log in.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is invalid.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-form-wrapper">
        <h2>Create an Account</h2>
        <p className="subheading">Join us today</p>

        {/* Signup form */}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={name} // Updated to use 'name'
            onChange={(e) => setName(e.target.value)} // Updated to use 'name'
            placeholder="Name"
            required
            className="auth-input"
            autoComplete="name"
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="auth-input"
            autoComplete="email"
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="auth-input"
            autoComplete="new-password"
            disabled={loading}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="auth-input"
            autoComplete="new-password"
            disabled={loading}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="auth-input"
            disabled={loading}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="artist">Artist</option>
            <option value="client">Client</option>
          </select>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
