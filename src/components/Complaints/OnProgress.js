import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import profileicon from '../public/profile-icon.png';

const OnProgress = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRemarks, setViewRemarks] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('incident_report')
        .select('student_id, description, submitted_at, remarks')
        .eq('progress', 'In Progress'); // Ensure you only fetch reports that are currently "In Progress"

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

  const openViewModal = (remarks) => {
    setViewRemarks(remarks || 'No remarks available');
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewRemarks('');
  };

  const markAsSolved = async (studentId) => {
    const { error } = await supabase
      .from('incident_report')
      .update({ progress: 'Solved' }) // Update the status to 'Solved'
      .eq('student_id', studentId);

    if (error) {
      console.error('Error updating report status:', error.message);
    } else {
      // Optionally, you can remove it from the state
      setReports((prevReports) => prevReports.filter(report => report.student_id !== studentId));
      alert('Report marked as solved!');
    }
  };

  const markAsUnsolved = async (studentId) => {
    const { error } = await supabase
      .from('incident_report')
      .update({ progress: null }) // Remove the progress data
      .eq('student_id', studentId);

    if (error) {
      console.error('Error updating report status:', error.message);
    } else {
      // Optionally, you can remove it from the state
      setReports((prevReports) => prevReports.filter(report => report.student_id !== studentId));
      alert('Report marked as unsolved!');
      navigate('/Pending'); // Redirect to Pending page after marking as unsolved
    }
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
          <button onClick={() => navigate('/Admin')}>Dashboard</button>
          <button>Complaints</button>
          <div className='complaints'>
            <button onClick={() => navigate('/Pending')}>Pending</button>
            <button onClick={() => navigate('/OnProgress')}>On Progress</button>
            <button onClick={() => navigate('/Solved')}>Solved</button>
          </div>
          <button onClick={() => navigate('/users')}>Registered Users</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="admin-container">
        <div className='header-container'>
          <div className='menu-icon'><FontAwesomeIcon icon={faBars} /></div>
        </div>
        <div className='report-title'>On Progress</div>
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
                  <th>Take Action</th>
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
                    <td>
                      <button onClick={() => markAsSolved(report.student_id)}>Solved</button>
                      <button onClick={() => markAsUnsolved(report.student_id)}>Unsolved</button>
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

export default OnProgress;
