import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { supabase } from '../utils/supabaseClient' // Import Supabase client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import profileicon from '../public/profile-icon.png';

const OnProgress = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchReports = async () => {
      // Fetch data from Supabase with the necessary filtering
      const { data, error } = await supabase
        .from('incident_report')
        .select('student_id, description, submitted_at')
        .eq('progress', 1); // Use .eq() to filter rows where progress = 1
  
      // Log the data and error for debugging
      console.log('Data:', data);
      console.log('Error:', error);
  
      // Handle the response
      if (error) {
        console.error('Error fetching reports:', error.message);
      } else if (data) {
        setReports(data);
        console.log('Fetched reports:', data);
      }
  
      setLoading(false); // Update loading state
    };
  
    fetchReports();
  }, []); // Empty dependency array to run once on mount

  // Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      // Redirect to login page or perform other actions after logout
      window.location.href = '/'; // Redirect to the login page
    }
  };

  // Function to navigate to the Users page
  const navigateToUsers = () => {
    navigate('/users'); // Navigate to the Users page
  };

  const navigateToDashboard = () => {
    navigate('/Admin'); // Navigate to the Users page
  };

  const navigateToPending = () => {
    navigate('/Pending'); // Navigate to the Users page
  };

  const navigateToOnProgress = () => {
    navigate('/OnProgress'); // Navigate to the Users page
  };

  const navigateToSolved = () => {
    navigate('/Solved'); // Navigate to the Users page
  };

  return (
    <div className='container'>
      <div className='side-bar'>
          <div className='Logo'>PARK NIGGA</div>
          <div className='Profile'>
            <img src={profileicon} alt="profile-icon"></img>
            <div>ADMIN</div>
            <div>Settings</div>
          </div>
          <div className='Dashboard'>
            <button onClick={navigateToDashboard}>Dashboard</button>
            <button>Complaints</button>
              <div className='complaints'>
              <button onClick={navigateToPending}>Pending</button>
                <button onClick={navigateToOnProgress}>On Progress</button>
                <button onClick={navigateToSolved}>Solved</button>
              </div>
            <button onClick={navigateToUsers}>Registered Users</button>
            <button>Button 2</button>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
      </div>
    <div className="admin-container">
      <div className='header-container'>
     <div className='menu-icon'> <FontAwesomeIcon icon={faBars} /></div>
      </div>
      <div className='report-title'>Dashboard</div>
      <div className="report-container">
          {/* Show loading message if data is still being fetched */}
          <div className='table-title-onprogress'>On Progress</div>
         {loading ? (
        <p>Loading users...</p>
      ) : reports.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Student ID</th> {/* Column for numbering */}
              <th>Date</th> {/* Column for Student ID */}
              <th className='description-container'>Description</th> {/* Column for creation date */}
              <th>Take Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.student_id}>
                <td>{index + 1}</td> {/* Display index as row number */}
                <td>{report.student_id}</td> {/* Display student ID */}
                <td>{new Date(report.submitted_at).toLocaleDateString()}</td> {/* Format and display creation date */}
                <td className='description-container'>{report.description}</td> {/* Display student ID */}
                <td className='send-button'><button>View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No registered users found.</p> // Show message if no users are found
      )}
        </div>
      </div>
    </div>
  );
};

export default OnProgress;
