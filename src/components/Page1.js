import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import icons
import favicon from './public/profile-icon.png'; // Adjust the path as necessary

const Page1 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [showComplaints, setShowComplaints] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState(''); // State for proof URL
  const [isProofModalOpen, setIsProofModalOpen] = useState(false); // State for proof modal

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting user:', userError.message);
        toast.error('Failed to get user data. Please log in again.');
        navigate('/login');
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('student_id, name, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
          toast.error('Error fetching user profile data.');
          return;
        }

        if (!data) {
          toast.error('User profile not found.');
          return;
        }

        setUserInfo(data);
      } else {
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      toast.error('Error signing out. Please try again.');
      return;
    }

    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const fetchComplaints = async () => {
    if (!userInfo) return;

    const { data, error } = await supabase
      .from('incident_report')
      .select('student_id, submitted_at, description, proof_of_incident, remarks') // Include remarks
      .eq('student_id', userInfo.student_id);

    if (error) {
      console.error('Error fetching complaints:', error.message);
      toast.error('Error fetching complaints. Please try again.');
      return;
    }

    if (data) {
      const formattedComplaints = data.map(complaint => ({
        ...complaint,
        submission_date: new Date(complaint.submitted_at).toLocaleString()
      }));

      setComplaints(formattedComplaints);
      setShowComplaints(true);
    }
  };

  const toggleComplaints = () => {
    if (!showComplaints) {
      fetchComplaints();
    }
    setShowComplaints(!showComplaints);
  };

  const handleShowProof = (proofUrl) => {
    setProofUrl(proofUrl);
    setIsProofModalOpen(true); // Open proof modal
  };

  const closeProofModal = () => {
    setIsProofModalOpen(false);
    setProofUrl('');
  };

  const handleShowRemarks = (remarks) => {
    setSelectedRemarks(remarks ? remarks.split(';') : []); // Assuming remarks are separated by semicolons
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page1-container">
      <div className="page1-sidebar">
        {/* Add the logo above the Profile button */}
        <img src={favicon} alt="Logo" className="sidebar-logo" />
        <button className="page1-sidebar-button" onClick={() => setShowComplaints(false)}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </button>
        <button className="page1-sidebar-button" onClick={toggleComplaints}>
          <FontAwesomeIcon icon={faComments} /> {showComplaints ? 'Hide Complaints' : 'View Complaints'}
        </button>
        <button className="page1-sidebar-button" onClick={() => navigate('/incident-report')}>
          <FontAwesomeIcon icon={faFileAlt} /> Report Incident
        </button>
        
        {/* Add the Logout button at the bottom */}
        <button className="admin1-logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
      <div className="page1-content">
        <div className="page1-no-edge-box">
          <h1 className="page1-parktrack-title">PARKTRACK</h1>
          {showComplaints ? (
            <>
              <h3>Your Complaints:</h3>
              {complaints.length > 0 ? (
                <div className="page1-complaints-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Date Submitted</th>
                        <th>Description</th>
                        <th>Proof of Incident</th>
                        <th>Admin's Remark</th>
                      </tr>
                    </thead>
                    <tbody>
  {complaints.map((complaint, index) => (
    <tr key={index}>
      <td>{complaint.student_id}</td>
      <td>{complaint.submission_date}</td>
      <td>{complaint.description}</td>
      <td>
        <button 
          className="page1-view-proof-button" // Using the new class
          onClick={() => handleShowProof(complaint.proof_of_incident)}
        >
          View Proof
        </button>
      </td>
      <td>
        <button 
          className="page1-view-remarks-button" // Using the new class
          onClick={() => handleShowRemarks(complaint.remarks)}
        >
          {complaint.remarks ? "View Remarks" : "No Remarks"}
        </button>
      </td>
    </tr>
  ))}
</tbody>
                  </table>
                </div>
              ) : (
                <p>No complaints found.</p>
              )}
            </>
          ) : (
            <>
              <h2 className="page1-login-header">Student Information</h2>
              <div className="page1-user-info">
                <p><strong>Student ID:</strong> {userInfo.student_id}</p>
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal for Proof of Incident */}
      {isProofModalOpen && (
        <div className="modal-overlay" onClick={closeProofModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Proof of Incident</h3>
            <img src={proofUrl} alt="Proof of incident" className="proof-image" />
            <button onClick={closeProofModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for Admin's Remarks */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Admin's Remarks</h3>
            <ul>
              {selectedRemarks.length > 0 ? (
                selectedRemarks.map((remark, index) => <li key={index}>{remark}</li>)
              ) : (
                <li>No remarks available</li>
              )}
            </ul>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page1;
