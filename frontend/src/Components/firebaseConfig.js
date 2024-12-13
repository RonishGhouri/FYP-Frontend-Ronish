// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase Auth
import { getFirestore } from "firebase/firestore"; // Firestore

// Firebase configuration for your app
const firebaseConfig = {
  apiKey: "AIzaSyCFO1-XowfNHFwTf1ZRtEEEJfx8VcB3FvQ",
  authDomain: "kalakaar-17.firebaseapp.com",
  projectId: "kalakaar-17",
  storageBucket: "kalakaar-17.appspot.com", // Firebase storage bucket
  messagingSenderId: "283435708844",
  appId: "1:283435708844:web:e59606bd0130a094a44a09",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore database

// Export the Firebase services so they can be used in other parts of your app
export { auth, db};
export default app;


