import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { supabase } from './supabaseClient'; // Import Supabase client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faBarsProgress, faCheckDouble, faBars } from '@fortawesome/free-solid-svg-icons';
import profileicon from './public/profile-icon.png';

const Admin = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [slotsLeft] = useState(10);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Clear authentication state
    navigate('/login'); // Redirect to login
  };
  // Function to navigate to the Users page
  const navigateToUsers = () => {
    navigate('/users'); // Navigate to the Users page
  };

  const navigateToPending = () => {
    navigate('/Pending'); // Navigate to the Users page
  };

  const navigateToOnProgress = () => {
    navigate('/OnProgress'); // Navigate to the Users page
  };

  const navigateToSolved = () => {
    navigate('/Solved'); // Navigate to the Users page
  };


  return (
    <div className='container'>
      <div className='side-bar'>
          <div className='Logo'>PARK NIGGA</div>
          <div className='Profile'>
            <img src={profileicon} alt="profile-icon"></img>
            <div>ADMIN</div>
            <div>Settings</div>
          </div>
          <div className='Dashboard'>
            <button>Dashboard</button>
            <button onClick={navigateToPending}>Complaints</button>
            <button onClick={navigateToUsers}>Registered Users</button>
            <button>Button 2</button>
            <button onClick={handleLogout} className="logout-button1">Logout</button>
          </div>
      </div>
    <div className="admin-container">
      <div className='header-container'>
     <div className='menu-icon'> <FontAwesomeIcon icon={faBars} /></div>
      </div>
      <div className='report-title'>Dashboard</div>
      <div className="report-container">

        <div className="dashboard-content">
        <div className="slots-container">
          <p className="slots-text">SLOTS LEFT</p>
          <h2 className="slots-number">{slotsLeft}</h2>
        </div>
      </div>

        <div className='progress-container'>
          <div className='pending' onClick={navigateToPending}>
            <section className='pending-icon'>
              <FontAwesomeIcon icon={faSpinner}/>
            </section> 
              <section>0 </section>
              <section>Pending</section>
            </div>
          <div className='onprogress' onClick={navigateToOnProgress}>
            <section className='onprogress-icon'>  <FontAwesomeIcon icon={faBarsProgress} /> </section>
            <section>0 </section>
              <section>On Progress</section>
            </div>
          <div className='solved' onClick={navigateToSolved}>
            <section className='solved-icon'> <FontAwesomeIcon icon={faCheckDouble} /></section>
           <section>0 </section>
           <section>Solved</section>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
