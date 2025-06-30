// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  const spinnerStyles = {
    spinnerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      minHeight: '80px',
    },
    spinner: {
      border: '4px solid rgba(0, 123, 255, 0.2)', // Light blue
      borderTop: '4px solid #007bff', // Blue
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 0.8s linear infinite', // This requires a global CSS animation, which we can't define inline
    },
    // We'll need to define the @keyframes spin directly in an <style> tag or globally if 'no css' is strict.
    // For now, the animation property will be there, but the animation itself won't work purely inline.
    // I'll provide a single <style> block in App.js for global animations and body reset.
  };

  return (
    <div style={spinnerStyles.spinnerContainer} aria-label="Loading content">
      <div style={spinnerStyles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;