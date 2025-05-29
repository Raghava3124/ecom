import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Oops! Page Not Found</h2>
        <p className="error-description">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <button className="error-btn" onClick={() => navigate('/')}>
          ⬅️ Back to Home
        </button>
      </div>
    </div>
  );
};

export default Error;
