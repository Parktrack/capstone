import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase client
import './Page1.css'; // Ensure to import your CSS file
import { toast } from 'react-toastify'; // Import Toast for notifications

const Page1 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

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
          .eq('id', user.id) // Ensure 'id' corresponds to the correct user identifier in your table
          .limit(1) // Limit to one result
          .single(); // Fetch a single row

        if (error) {
          if (error.message.includes("multiple rows returned")) {
            toast.error('Multiple profiles found. Please contact support.'); // Handle case of multiple rows
            console.error('Error fetching user data:', error.message);
          } else {
            toast.error('Error fetching user profile data.');
            console.error('Error fetching user data:', error.message);
          }
          return;
        }

        if (!data) {
          toast.error('User profile not found.'); // Handle case where no data is returned
          return;
        }

        setUserInfo(data); // Set the fetched user info
      } else {
        navigate('/login'); // Redirect to login if no user is logged in
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Sign out the user

    if (error) {
      console.error('Error signing out:', error.message);
      toast.error('Error signing out. Please try again.');
      return;
    }

    // Clear local storage (optional)
    localStorage.removeItem('isAuthenticated'); // Ensure to clear any relevant local storage if needed

    navigate('/login'); // Redirect to login page after logout
  };

  if (!userInfo) {
    return <div>Loading...</div>; // Display loading state until user data is fetched
  }

  return (
    <div className="login-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2 className="login-header">Student Information</h2>
      <div className="user-info">
        <p><strong>Student ID:</strong> {userInfo.student_id}</p>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
      </div>
      <div className="button-group">
        <button className="submit-button" onClick={() => navigate('/incident-report')}>
          REPORT AN INCIDENT
        </button>
      </div>
    </div>
  );
};

export default Page1;
