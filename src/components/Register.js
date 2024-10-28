import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase client
import { ToastContainer, toast } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toast

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    studentId: '',
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    studentId: Yup.string()
      .matches(/^[0-9]{10}$/, 'Student ID must be exactly 10 digits')
      .required('Student ID is required'),
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  });

  const onSubmit = async (values) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            studentId: values.studentId,
            name: values.name,
          },
        },
      });

      // Log the entire response to see its structure
      console.log('Supabase sign up response:', data, error);

      if (error) {
        console.error('Error signing up:', error.message);
        toast.error(`Error: ${error.message}`); // Notify user of error
        return;
      }

      // Check if user data is present in the response
      if (!data || !data.user) {
        throw new Error('Sign-up successful but user data is missing.');
      }

      // Insert user profile data into the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, // Use the user's unique ID from authentication
            student_id: values.studentId,
            name: values.name,
            email: values.email,
          },
        ]);

      if (profileError) {
        console.error('Error inserting profile data:', profileError.message);
        toast.error(`Error saving profile data: ${profileError.message}`);
        return;
      }

      console.log('User signed up and profile data saved successfully:', data);
      toast.success('Registration successful! Please check your email to confirm your account.'); // Notify user of success
      navigate('/'); // Redirect to the login page after successful registration
    } catch (error) {
      console.error('Error during sign up:', error.message);
      toast.error(`Error: ${error.message}`); // Notify user of error
    }
  };

  return (
    <div className="register-container">
      <ToastContainer /> {/* ToastContainer to render the notifications */}
      <h2>Register</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="register-form">
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <Field 
              name="studentId" 
              className="form-input" 
              type="text" 
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                  event.preventDefault();
                }
              }} 
            />
            <ErrorMessage name="studentId" component="div" className="error-message" />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <Field name="name" className="form-input" />
            <ErrorMessage name="name" component="div" className="error-message" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <Field type="email" name="email" className="form-input" />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <Field type="password" name="password" className="form-input" />
            <ErrorMessage name="password" component="div" className="error-message" />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">Register</button>
            <button type="button" className="register-button" onClick={() => navigate('/Login')}>Back to Login</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
