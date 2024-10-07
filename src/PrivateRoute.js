// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig.js'; 

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser; // Check the current user from Firebase Auth

  // If no user is logged in, redirect to the login page
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
