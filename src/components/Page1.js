import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient'; // Import Supabase client
import { toast } from 'react-toastify'; // Import Toast for notifications

const Page1 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [showComplaints, setShowComplaints] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting user:', userError.message);
        toast.error('Failed to get user data. Please log in again.');
        navigate('/login');
        return;
      }

      if (user) {
        // Fetch user profile data from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('student_id, name, email')
          .eq('id', user.id)
          .single(); // Fetch a single row

        if (error) {
          console.error('Error fetching user data:', error.message);
          toast.error(error.message.includes("multiple rows returned")
            ? 'Multiple profiles found. Please contact support.'
            : 'Error fetching user profile data.');
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

    // Clear local storage
    localStorage.removeItem('isAuthenticated');

    navigate('/login'); // Redirect to login page after logout
  };

  const fetchComplaints = async () => {
    if (!userInfo) return;

    const { data, error } = await supabase
      .from('incident_report')
      .select('student_id, submitted_at, description') // Added description
      .eq('student_id', userInfo.student_id);

    if (error) {
      console.error('Error fetching complaints:', error.message);
      toast.error('Error fetching complaints. Please try again.');
      return;
    }

    if (data) {
      // Parse dates into a more usable format
      const formattedComplaints = data.map(complaint => ({
        ...complaint,
        submission_date: new Date(complaint.submitted_at).toLocaleString() // Format the date
      }));

      setComplaints(formattedComplaints);
      setShowComplaints(true); // Show complaints when fetched
    }
  };

  const toggleComplaints = () => {
    if (!showComplaints) {
      fetchComplaints(); // Fetch complaints only when showing them
    }
    setShowComplaints(!showComplaints); // Toggle visibility
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page1-container">
      <div className="page1-sidebar">
        <button className="page1-sidebar-button" onClick={() => setShowComplaints(false)}>
          Profile
        </button>
        <button className="page1-sidebar-button" onClick={toggleComplaints}>
          {showComplaints ? 'Hide Complaints' : 'View Complaints'}
        </button>
        <button className="page1-sidebar-button" onClick={() => navigate('/incident-report')}>
          Report Incident
        </button>
        <button className="page1-logout-button" onClick={handleLogout}>
          Logout
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
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint, index) => (
                        <tr key={index}>
                          <td>{complaint.student_id}</td>
                          <td>{complaint.submission_date}</td>
                          <td>{complaint.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No complaints found.</p> // Message if no complaints exist
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
    </div>
  );
};

export default Page1;
