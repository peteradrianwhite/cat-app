import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatInfo from './CatInfo'; // Your CatInfo component
import Login from './login'; // Your Login component
import SignUp from './signup'; // Your SignUp component
import PrivateRoute from './PrivateRoute'; // Your PrivateRoute component

const AppRouter = () => {
  return (
    <Router> {/* This should be the only Router in your app */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <CatInfo />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
