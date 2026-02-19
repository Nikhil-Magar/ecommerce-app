import React from 'react';
import './Welcome.css';
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <>
      <div className="welcome-container">
        <h1 className="animated-title">Welcome to Bagmati</h1>

        <Link to="/home">
          <button className="explore-btn">Explore</button>
        </Link>

      </div>
    </>
  )
}
