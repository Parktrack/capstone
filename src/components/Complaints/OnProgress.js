import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import profileicon from '../public/profile-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboard, faClipboardCheck, faClipboardList, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const OnProgress = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [remarksInput, setRemarksInput] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRemarks, setViewRemarks] = useState('');
  const navigate = useNavigate();

  // Fetch reports function
  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('incident_report')
      .select('student_id, description, proof_of_incident, remarks, submitted_at')
      .eq('progress', 1);

    if (error) {
      console.error('Error fetching reports:', error.message);
    } else {
      console.log('Fetched reports:', data);
      setReports(data);
    }
    setLoading(false);
  };

  useEffect(() => {
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

  const openSendModal = (studentId) => {
    setSelectedStudentId(studentId);
    setShowSendModal(true);
  };

  const closeSendModal = () => {
    setShowSendModal(false);
    setRemarksInput('');
  };

  const sendRemarks = async () => {
    if (remarksInput && selectedStudentId) {
      console.log(`Sending remarks: ${remarksInput} for Student ID: ${selectedStudentId}`);

      const { data, error } = await supabase
        .from('incident_report')
        .update({ remarks: remarksInput })
        .eq('student_id', selectedStudentId)
        .select('student_id, remarks');

      if (error) {
        console.error('Error sending remarks:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.log('Data returned from Supabase:', data);
        if (data.length > 0) {
          alert('Remarks sent successfully!');
          await fetchReports();
        } else {
          alert('No data returned. Please check if the student ID is correct.');
        }
      }
      closeSendModal();
    } else {
      console.warn('Remarks input or selectedStudentId is empty');
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

  return (
    <div className='admin1-container'>
      <div className='admin1-sidebar'>
        <div className='admin1-profile'>
          <img src={profileicon} alt="profile-icon" />
          <div>ADMIN</div>
        </div>
        <div className='admin1-dashboard'>
          <button onClick={() => navigate('/Admin')} className="admin1-sidebar-button">
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
          <button className="admin1-sidebar-button" onClick={() => navigate('/users')}>
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
        <div className="admin1-report-container">
          <div className='admin1-table-title'>On Progress</div>
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
                      <button onClick={() => openViewModal(report.remarks)} className="admin1-view-remarks-button">
                        View Remarks
                      </button>
                    </td>
                    <td>
                      <button onClick={() => openSendModal(report.student_id)} className="admin1-send-remarks-button">
                        Send Remarks
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

      {/* Send Remarks Modal */}
      {showSendModal && (
        <div className="admin1-modal">
          <div className="admin1-modal-content">
            <h2>Send Remarks</h2>
            <textarea
              value={remarksInput}
              onChange={(e) => setRemarksInput(e.target.value)}
              placeholder="Enter remarks here..."
            />
            <button onClick={sendRemarks} className="admin1-send-button">Send</button>
            <button onClick={closeSendModal} className="admin1-cancel-button">Cancel</button>
          </div>
        </div>
      )}

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
