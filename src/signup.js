import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig.js'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // For navigation
import './signup.css'; // Create a CSS file for styling

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the main app on successful signup
    } catch (error) {
      setError(error.message); // Set the error message
    }
  };

  return (
    <div className="signup-container">
      <h3 className="signup-title">Sign Up</h3>
      {error && <div className="error-box">{error}</div>} {/* Display error if present */}
      <input
        type="email"
        className="signup-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="signup-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp} className="signup-button">Sign Up</button>
      <p className="signup-text">
        Already have an account? <a href="/login" className="signup-link">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
