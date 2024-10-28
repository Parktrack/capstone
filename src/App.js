import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Page1 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incident-report" element={<IncidentReport />} />
        <Route path='/Pending' element={<Pending/>} />
        <Route path='/OnProgress' element={<OnProgress/>} />
        <Route path='/Solved' element={<Solved/>} />
      </Routes>
    </Router>
  );
}

export default App;
