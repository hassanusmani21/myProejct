import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

// Fallback UI for errors
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to home or any other route, and reset the error boundary state
    navigate('/');  // Change this to whatever route you want
    resetErrorBoundary();  // This will reset the error state after redirecting
  }, [navigate, resetErrorBoundary]);

  return (
    <div role="alert" style={{ padding: "1em", color: "red" }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <p>Redirecting to Home...</p>
    </div>
  );
};

// Export the ErrorBoundary component with the fallback
export default function CustomErrorBoundary({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
