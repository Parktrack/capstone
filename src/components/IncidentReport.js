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
    <div className="no-edge-box">
      <div className="incident-report-container">
        <h1 className="parktrack-title">PARKTRACK</h1>
        <h2 className="section-header">Incident Report</h2>
        <button className="back-button" onClick={() => navigate('/profile')}>Back to Profile</button>
        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) setStudentId(value);
              }}
              maxLength="10"
              required
              className="form-input"
              placeholder="Enter up to 10 digits only"
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
      </div>
    </div>
  );
};

export default IncidentReport;
