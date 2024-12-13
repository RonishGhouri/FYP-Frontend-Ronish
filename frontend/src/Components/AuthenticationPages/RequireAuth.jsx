import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authContext"; // Ensure authContext is implemented

const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
