import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient'; // Import Supabase client
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

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-container">
      <button className="logout-button2" onClick={handleLogout}>
        Logout
      </button>
    <div className="no-edge-box">
      <h1 className="parktrack-title">PARKTRACK</h1>
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
    </div>
  );
};

export default Page1;
