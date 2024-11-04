import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboard, faClipboardCheck, faClipboardList, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
    <div className='admin1-container'>
      <div className='admin1-sidebar'>
        <div className='admin1-profile'>
          <img src={profileicon} alt="profile-icon" />
          <div>ADMIN</div>
        </div>
        <div className='admin1-dashboard'>
          <button onClick={navigateToDashboard} className="admin1-sidebar-button">
            <FontAwesomeIcon icon={faTachometerAlt} className="admin1-icon" />
            Dashboard
          </button>
          <button className="admin1-sidebar-button">
            <FontAwesomeIcon icon={faClipboard} className="admin1-icon" />
            Complaints
          </button>
          <div className='admin1-complaints'>
            <button className="admin1-sidebar-button" onClick={() => navigate('/Pending')}>
              <FontAwesomeIcon icon={faClipboardList} className="admin1-icon" />
              Pending
            </button>
            <button className="admin1-sidebar-button" onClick={() => navigate('/OnProgress')}>
              <FontAwesomeIcon icon={faClipboardCheck} className="admin1-icon" />
              On Progress
            </button>
            <button className="admin1-sidebar-button" onClick={() => navigate('/Solved')}>
              <FontAwesomeIcon icon={faClipboardCheck} className="admin1-icon" />
              Solved
            </button>
          </div>
          <button onClick={navigateToUsers} className="admin1-sidebar-button">
            <FontAwesomeIcon icon={faUsers} className="admin1-icon" />
            Registered Users
          </button>
          <button onClick={handleLogout} className="admin1-logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} className="admin1-icon" />
            Logout
          </button>
        </div>
      </div>

      <div className="admin1-content">
        <div className='admin1-header-container'>
          <div className='admin1-table-title'>Solved Reports</div>
        </div>
        <div className="admin1-report-container">
          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length > 0 ? (
            <table className="admin1-users-table">
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
                      <button onClick={() => openViewModal(report.remarks)} className="admin1-view-remarks-button">
                        View Remarks
                      </button>
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
        <div className="admin1-modal">
          <div className="admin1-modal-content">
            <h2>View Remarks</h2>
            <p>{viewRemarks}</p>
            <button onClick={closeViewModal} className="admin1-close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solved;
