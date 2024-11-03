import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faBarsProgress, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import profileicon from './public/profile-icon.png';

const Admin = () => {
  const navigate = useNavigate();
  const [slotsLeft] = useState(10);
  const [pendingCount, setPendingCount] = useState(0);
  const [onProgressCount, setOnProgressCount] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);

  // Add handleLogout function here
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Clear authentication state
    navigate('/login'); // Redirect to login
  };

  useEffect(() => {
    const fetchReportCounts = async () => {
      try {
        // Fetch pending reports: progress = 0 and remarks = null
        const { data: pendingReports, error: pendingError } = await supabase
          .from('incident_report')
          .select('*')
          .eq('progress', 0)
          .is('remarks', null);

        if (pendingError) throw pendingError;
        setPendingCount(pendingReports.length);

        // Fetch on progress reports: progress = 1 and remarks is not null
        const { data: onProgressReports, error: onProgressError } = await supabase
          .from('incident_report')
          .select('*')
          .eq('progress', 1)
          .not('remarks', 'is', null);

        if (onProgressError) throw onProgressError;
        setOnProgressCount(onProgressReports.length);

        // Fetch solved reports: progress = 2 and remarks is not null
        const { data: solvedReports, error: solvedError } = await supabase
          .from('incident_report')
          .select('*')
          .eq('progress', 2)
          .not('remarks', 'is', null);

        if (solvedError) throw solvedError;
        setSolvedCount(solvedReports.length);
      } catch (error) {
        console.error('Error fetching report counts:', error);
      }
    };

    fetchReportCounts();
  }, []);

  return (
    <div className='admin1-container'>
      <div className='admin1-sidebar'>
        <div className='admin1-profile'>
          <img src={profileicon} alt="profile-icon" />
          <div>ADMIN</div>
        </div>
        <div className='admin1-dashboard'>
          <button className="admin1-sidebar-button">Dashboard</button>
          <button className="admin1-sidebar-button" onClick={() => navigate('/Pending')}>Complaints</button>
          <button className="admin1-sidebar-button" onClick={() => navigate('/users')}>Registered Users</button>
          <button className="admin1-logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="admin1-content">
        <div className="admin1-no-edge-box">
          <div className="admin1-parktrack-title">PARKTRACK</div>
          <div className="dashboard-content">
            <div className="slots-container">
              <p className="slots-text">SLOTS LEFT</p>
              <h2 className="slots-number">{slotsLeft}</h2>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="admin1-pending" onClick={() => navigate('/Pending')}>
              <section className="admin1-icon pending-icon">
                <FontAwesomeIcon icon={faSpinner} />
              </section>
              <section className="count">{pendingCount}</section>
              <section className="label">Pending</section>
            </div>
            <div className="admin1-onprogress" onClick={() => navigate('/OnProgress')}>
              <section className="admin1-icon onprogress-icon">
                <FontAwesomeIcon icon={faBarsProgress} />
              </section>
              <section className="count">{onProgressCount}</section>
              <section className="label">On Progress</section>
            </div>
            <div className="admin1-solved" onClick={() => navigate('/Solved')}>
              <section className="admin1-icon solved-icon">
                <FontAwesomeIcon icon={faCheckDouble} />
              </section>
              <section className="count">{solvedCount}</section>
              <section className="label">Solved</section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Admin;
