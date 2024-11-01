import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { supabase } from './supabaseClient'; // Import Supabase client
import { ToastContainer, toast } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toast

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(`Login failed: ${error.message}`); // Notify user of error
        return;
      }

      // Save authentication state in local storage
      localStorage.setItem('isAuthenticated', 'true'); // Set authentication flag

      // Check if the logged-in user is the admin
      const adminEmail = 'admin@gmail.com'; // Replace with your actual admin email
      if (values.email === adminEmail) {
        toast.success('Login successful! Redirecting to admin page...');
        navigate('/admin'); // Redirect to the admin page
      } else {
        toast.success('Login successful! Redirecting to dashboard...');
        navigate('/profile'); // Redirect to the user dashboard
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      toast.error(`Error: ${error.message}`); // Notify user of error
    } finally {
      setSubmitting(false); // Always set submitting to false when done
    }
  };

  return (
    <div className="login-container">
      <ToastContainer /> {/* ToastContainer to render the notifications */}
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
      <h2 className="login-header">Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => ( // Access isSubmitting to disable button
          <Form className="login-form">
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
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                Login
              </button>
              <button type="button" className="register-button" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
