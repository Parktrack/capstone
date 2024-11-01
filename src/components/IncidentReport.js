import React, { useState } from 'react';
import { supabase } from './utils/supabaseClient'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './IncidentReport.css'; // Ensure to import your CSS file

const IncidentReport = () => {
  const [studentId, setStudentId] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the photo is selected
    if (!photo) {
      setMessage('Please upload a photo.');
      return;
    }

    // Upload the photo to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('incident-report') // Use your bucket name
      .upload(`private/${studentId}/${photo.name}`, photo); // Upload with studentId as a folder

    if (uploadError) {
      setMessage(`Failed to upload image: ${uploadError.message}`);
      return;
    }

    // Prepare data to send to your Supabase table
    const reportData = {
      student_id: studentId, // Assuming your column is named 'student_id'
      description
      // Removed photo_path since it's not being stored
    };

    // Send reportData to your Supabase table
    const { error: insertError } = await supabase
      .from('incident_report') // Change this to your actual table name
      .insert([reportData]);

    if (insertError) {
      setMessage(`Failed to submit report: ${insertError.message}`);
      return;
    }

    setMessage('Incident report submitted successfully!');
    // Clear form after submission
    setStudentId('');
    setDescription('');
    setPhoto(null);
  };

  // Function to navigate back to the profile page
  const handleBack = () => {
    navigate('/profile'); // Adjust this path to your actual profile page route
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Incident Report</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">Student ID</label>
          <input 
            type="text" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Upload Photo</label>
          <input 
            type="file" 
            onChange={(e) => setPhoto(e.target.files[0])} 
            required 
            className="form-input"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="button-group">
        <button onClick={handleBack} className="back-button">Back to Profile</button>
      </div>
    </div>
  );
};

export default IncidentReport;
