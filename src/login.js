import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig.js'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // For navigation
import './login.css'; // Import CSS for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the main app on successful login
    } catch (error) {
      setError(error.message); // Set error message
    }
  };

  return (
    <div className="login-container">
      <h3 className="login-title">Login</h3>
      {error && <div className="error-box">{error}</div>} {/* Display error message if present */}
      <input
        type="email"
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="login-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="button-style">Login</button>
      <p className="login-text">
        Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
      </p> 
    </div>
  );
};

export default Login;
