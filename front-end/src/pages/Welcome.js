import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome to <span className="brand-name">Bagmati</span>
          </h1>

          <div className="welcome-buttons">
            <button
              className="explore-btn"
              onClick={() => navigate('/home')}
            >
              <span className="btn-text">Explore</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
