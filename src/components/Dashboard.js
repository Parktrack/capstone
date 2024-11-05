import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [slotsLeft] = useState(150);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          <img src="/favicon.ico" alt="USTP Parktrack Icon" className="favicon-icon" />
          PARKTRACK
        </h1>
        <div className="auth-buttons">
          <button className="auth-button" onClick={() => navigate('/login')}>Login</button>
          <button className="auth-button" onClick={() => navigate('/register')}>Register</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="slots-container">
          <p className="slots-text">SLOTS LEFT</p>
          <h2 className="slots-number">{slotsLeft}</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
