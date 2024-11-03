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
        .eq('progress', 1);

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
      .update({ progress: 2 }) // Update the status to 'Solved' (progress = 2)
      .eq('student_id', studentId);
  
    if (error) {
      console.error('Error updating report status:', error.message);
    } else {
      // Optionally, you can remove it from the state
      setReports((prevReports) => prevReports.filter(report => report.student_id !== studentId));
      alert('Report marked as solved!');
      // Optionally, navigate to the Solved page or refresh reports
      navigate('/Solved'); // Redirect to Solved page after marking as solved
    }
  };
  
  const markAsUnsolved = async (studentId) => {
    const { error } = await supabase
      .from('incident_report')
      .update({ 
        progress: 0,
        remarks: null,
      }) // Remove the progress data
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
    <div className='admin1-container'>
      <div className='admin1-sidebar'>
        <div className='admin1-profile'>
          <img src={profileicon} alt="profile-icon" />
          <div>ADMIN</div>
        </div>
        <div className='admin1-dashboard'>
          <button onClick={() => navigate('/Admin')} className="admin1-sidebar-button">Dashboard</button>
          <button className="admin1-sidebar-button">Complaints</button>
          <div className='admin1-complaints'>
            <button className="admin1-sidebar-button" onClick={() => navigate('/Pending')}>Pending</button>
            <button className="admin1-sidebar-button" onClick={() => navigate('/OnProgress')}>On Progress</button>
            <button className="admin1-sidebar-button" onClick={() => navigate('/Solved')}>Solved</button>
          </div>
          <button className="admin1-sidebar-button" onClick={() => navigate('/users')}>Registered Users</button>
          <button onClick={handleLogout} className="admin1-logout-button">Logout</button>
        </div>
      </div>
      <div className="admin1-content">
        <div className='admin1-header-container'>
        </div>
        <div className='admin1-table-title'>On Progress</div>
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
                      <button onClick={() => openViewModal(report.remarks)} className="admin1-view-remarks-button">View Remarks</button>
                    </td>
                    <td>
                      <button onClick={() => markAsSolved(report.student_id)} className="admin1-solved-button">Solved</button>
                      <button onClick={() => markAsUnsolved(report.student_id)} className="admin1-unsolved-button">Unsolved</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Reports Currently On Progress..</p>
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

export default OnProgress;
