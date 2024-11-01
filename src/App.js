import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import IncidentReport from './components/IncidentReport';
import Admin from './components/Admin';
import Users from './components/Users';
import Page1 from './components/Page1';
import Pending from './components/Complaints/Pending';
import OnProgress from './components/Complaints/OnProgress';
import Solved from './components/Complaints/Solved';
import ProtectedRoute from './components/utils/ProtectedRoutes'; // Make sure this is the one you want to use

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Page1 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/incident-report" 
          element={
            <ProtectedRoute>
              <IncidentReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Pending' 
          element={
            <ProtectedRoute>
              <Pending />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/OnProgress' 
          element={
            <ProtectedRoute>
              <OnProgress />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Solved' 
          element={
            <ProtectedRoute>
              <Solved />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
