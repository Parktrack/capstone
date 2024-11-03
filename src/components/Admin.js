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

  useEffect(() => {
    const fetchReportCounts = async () => {
      const { data: pendingReports, error: pendingError } = await supabase
        .from('incident_report')
        .select('*')
        .eq('progress', 0) // Pending reports
        .not('remarks', 'is', null); // Must have no remarks

      const { data: onProgressReports, error: onProgressError } = await supabase
        .from('incident_report')
        .select('*')
        .eq('progress', 1) // On progress reports
        .not('remarks', 'is', null); // Must have remarks

      const { data: solvedReports, error: solvedError } = await supabase
        .from('incident_report')
        .select('*')
        .eq('progress', 2) // Solved reports
        .not('remarks', 'is', null); // Must have remarks

      if (!pendingError) {
        setPendingCount(pendingReports.length);
      }
      if (!onProgressError) {
        setOnProgressCount(onProgressReports.length);
      }
      if (!solvedError) {
        setSolvedCount(solvedReports.length);
      }
    };

    fetchReportCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navigateToUsers = () => {
    navigate('/users');
  };

  const navigateToPending = () => {
    navigate('/Pending');
  };

  const navigateToOnProgress = () => {
    navigate('/OnProgress');
  };

  const navigateToSolved = () => {
    navigate('/Solved');
  };

  return (
    <div className='container'>
      <div className='side-bar'>
        <div className='Profile'>
          <img src={profileicon} alt="profile-icon" />
          <div>ADMIN</div>
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
        <div className='header-container'></div>
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
                <FontAwesomeIcon icon={faSpinner} />
              </section>
              <section>{pendingCount}</section>
              <section>Pending</section>
            </div>
            <div className='onprogress' onClick={navigateToOnProgress}>
              <section className='onprogress-icon'>
                <FontAwesomeIcon icon={faBarsProgress} />
              </section>
              <section>{onProgressCount}</section>
              <section>On Progress</section>
            </div>
            <div className='solved' onClick={navigateToSolved}>
              <section className='solved-icon'>
                <FontAwesomeIcon icon={faCheckDouble} />
              </section>
              <section>{solvedCount}</section>
              <section>Solved</section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
