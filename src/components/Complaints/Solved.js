import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import profileicon from '../public/profile-icon.png';

const Solved = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRemarks, setViewRemarks] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('incident_report')
        .select('student_id, description, submitted_at, remarks')
        .eq('progress', 2) // Fetch reports with progress = 2
        .not('remarks', 'is', null); // Ensure there are remarks

      if (error) {
        console.error('Error fetching reports:', error.message);
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      window.location.href = '/';
    }
  };

  const navigateToUsers = () => {
    navigate('/users');
  };

  const navigateToDashboard = () => {
    navigate('/Admin');
  };

  const openViewModal = (remarks) => {
    setViewRemarks(remarks || 'No remarks available');
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewRemarks('');
  };

  return (
    <div className='container'>
      <div className='side-bar'>
        <div className='Logo'>PARK NIGGA</div>
        <div className='Profile'>
          <img src={profileicon} alt="profile-icon" />
          <div>ADMIN</div>
          <div>Settings</div>
        </div>
        <div className='Dashboard'>
          <button onClick={navigateToDashboard}>Dashboard</button>
          <button>Complaints</button>
          <div className='complaints'>
            <button onClick={() => navigate('/Pending')}>Pending</button>
            <button onClick={() => navigate('/OnProgress')}>On Progress</button>
            <button onClick={() => navigate('/Solved')}>Solved</button>
          </div>
          <button onClick={navigateToUsers}>Registered Users</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="admin-container">
        <div className='header-container'>
          <div className='menu-icon'><FontAwesomeIcon icon={faBars} /></div>
        </div>
        <div className='report-title'>Solved Reports</div>
        <div className="report-container">
          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Student ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.student_id}>
                    <td>{index + 1}</td>
                    <td>{report.student_id}</td>
                    <td>{new Date(report.submitted_at).toLocaleDateString()}</td>
                    <td>{report.description}</td>
                    <td>
                      <button onClick={() => openViewModal(report.remarks)}>View Remarks</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reports found.</p>
          )}
        </div>
      </div>

      {/* View Remarks Modal */}
      {showViewModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>View Remarks</h2>
            <p>{viewRemarks}</p>
            <button onClick={closeViewModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solved;
