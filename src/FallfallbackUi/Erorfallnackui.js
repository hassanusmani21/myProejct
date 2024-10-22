import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

// Fallback UI for errors with customized styling
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/quotation');
      resetErrorBoundary();
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, resetErrorBoundary]);

  return (
    <div role="alert" style={errorContainerStyle}>
      <h2 style={headingStyle}>Something went wrong:</h2>
      <pre style={errorMessageStyle}>{error.message}</pre>
      <p style={redirectMessageStyle}>Redirecting to the quotation page in {countdown} seconds...</p>
    </div>
  );
};

// Custom styles to match your project
const errorContainerStyle = {
  padding: '1.5em',
  backgroundColor: '#f8f9fa',
  border: '1px solid #ced4da',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  marginLeft: '200px',  // This margin should be slightly more than the sidebar width
  marginTop: '120px',    // Adds a little space from the top
  maxWidth: '800px',    // Restricts the error container's width
};


const headingStyle = {
  color: '#003366',  // Navy blue color
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
};

const errorMessageStyle = {
  color: 'red',
  backgroundColor: '#f8d7da',
  // padding: '1rem',
  borderRadius: '4px',
  fontFamily: 'Courier, monospace',
};

const redirectMessageStyle = {
  fontSize: '1rem',
  color: '#0056b3',  // Blue color
  marginTop: '1rem',
};

// Export the ErrorBoundary component with the fallback
export default function CustomErrorBoundary({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
