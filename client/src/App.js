import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PrivateRoute from './component/PrivateRoute';
import WebcamDetection from './component/WebcamDetection'; // ✅ FIXED PATH

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
 
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/detect" 
          element={
            <PrivateRoute>
              <WebcamDetection />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />

      </Routes>
 
  );
}

export default App;