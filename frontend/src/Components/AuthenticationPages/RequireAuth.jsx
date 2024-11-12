import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const accessToken = localStorage.getItem('access');

  if (!accessToken) {
    // If no access token is found, redirect to the login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;
