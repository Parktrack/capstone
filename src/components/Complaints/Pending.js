import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import profileicon from '../public/profile-icon.png';

const Pending = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [remarksInput, setRemarksInput] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRemarks, setViewRemarks] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const navigate = useNavigate();
  const knownStudentId = '2021302071';

  // Define fetchReports function
  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('incident_report')
      .select('student_id, description, proof_of_incident, remarks, submitted_at')
      .is('remarks', null) // Only fetch reports with no remarks


    if (error) {
      console.error('Error fetching reports:', error.message);
    } else {
      console.log('Fetched reports:', data); // Log fetched data for debugging
      setReports(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports(); // Call fetchReports on component mount
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
        .select('student_id, remarks'); // Specify the columns you want to return
  
      if (error) {
        console.error('Error sending remarks:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.log('Data returned from Supabase:', data); // Log the returned data
        if (data.length > 0) {
          alert('Remarks sent successfully!');
          await fetchReports(); // Refetch the reports to see the updated data
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

  const viewProof = (proofUrl) => {
    setProofUrl(proofUrl);
    setShowProofModal(true);
  };

  const closeProofModal = () => {
    setShowProofModal(false);
    setProofUrl('');
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
        <div className='report-title'>Dashboard</div>
        <div className="report-container">
          <div className='table-title-pending'>Pending</div>
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
                  <th>Proof</th>
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
                    <td className='send-button'>
                      <button onClick={() => viewProof(report.proof_of_incident)}>View Proof</button>
                    </td>
                    <td>
                      <button onClick={() => openViewModal(report.remarks)}>View Remarks</button>
                    </td>
                    <td>
                      <button onClick={() => openSendModal(report.student_id)}>Send Remarks</button>
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
        <div className="modal">
          <div className="modal-content">
            <h2>Send Remarks</h2>
            <textarea
              value={remarksInput}
              onChange={(e) => setRemarksInput(e.target.value)}
              placeholder="Enter remarks here..."
            />
            <button onClick={sendRemarks}>Send</button>
            <button onClick={closeSendModal}>Cancel</button>
          </div>
        </div>
      )}

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

      {/* View Proof Modal */}
      {showProofModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>View Proof</h2>
            <img src={proofUrl} alt="Proof of Incident" style={{ maxWidth: '100%' }} />
            <button onClick={closeProofModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;
