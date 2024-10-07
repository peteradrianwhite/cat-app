// Logout.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig.js'; // Import Firebase auth from the config

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
