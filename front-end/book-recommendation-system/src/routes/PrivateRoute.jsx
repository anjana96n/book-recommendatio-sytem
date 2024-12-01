import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');  // Get token from localStorage

  if (!token) {
    // If no token is found, redirect to login page
    return <Navigate to="/login" />;
  }

  // If token exists, render the protected component (element)
  return element;
};

export default PrivateRoute;
