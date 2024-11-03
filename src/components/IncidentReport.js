import React, { useState } from 'react';
import { supabase } from './utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const IncidentReport = () => {
  const [studentId, setStudentId] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      setMessage('Please upload a photo.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: existingReports, error: fetchError } = await supabase
      .from('incident_report')
      .select('student_id')
      .eq('student_id', studentId)
      .gte('submitted_at', `${today}T00:00:00`)
      .lt('submitted_at', `${today}T23:59:59`);

    if (fetchError) {
      console.error('Error fetching existing reports:', fetchError.message);
      alert('An error occurred while checking your report limit. Please try again.');
      return;
    }

    if (existingReports.length >= 3) {
      setMessage('You have reached the limit of 3 reports for today.');
      return;
    }

    const filePath = `private/${studentId}/${photo.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('incident-report')
      .upload(filePath, photo);

    if (uploadError) {
      alert(`Failed to upload image: ${uploadError.message}`);
      console.error('Upload error:', uploadError);
      return;
    }

    const publicUrl = `${supabase.storageUrl}/object/public/incident-report/${filePath}`;

    const reportData = {
      student_id: studentId,
      description,
      proof_of_incident: publicUrl,
      submitted_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from('incident_report')
      .insert([reportData]);

    if (insertError) {
      alert(`Failed to submit report: ${insertError.message}`);
      return;
    }

    alert('Incident report submitted successfully!');
    setStudentId('');
    setDescription('');
    setPhoto(null);
  };

  return (
    <div className="report1-page">
      <h1 className="parktrack-title1">PARKTRACK</h1>
      <div className="report1-container">
        <h2 className="section-header">Incident Report</h2>
        <form onSubmit={handleSubmit} className="report1-form">
          <div className="report1-form-group">
            <label className="report1-form-label">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) setStudentId(value);
              }}
              maxLength="10"
              required
              className="report1-form-input"
              placeholder="Enter up to 10 digits only"
            />
          </div>
          <div className="report1-form-group">
            <label className="report1-form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="report1-form-input"
              placeholder='Please provide a clear description of what happened.'
            />
          </div>
          <div className="report1-form-group">
            <label className="report1-form-label">Upload Photo</label>
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              required
              className="report1-form-input"
            />
          </div>
          <div className="report1-button-group">
            <button type="submit" className="report1-submit-button">Submit</button>
            <button className="report1-back-button" onClick={() => navigate('/profile')}>Back to Profile</button>
          </div>
        </form>
        {message && <p className="report1-message">{message}</p>}
      </div>
    </div>
  );
};

export default IncidentReport;
