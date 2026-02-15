import React from 'react';
import logo from './Logo.png';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">

        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Logo" width="60" height="40" className="mx-2" />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
          </ul>

          <form className="d-flex me-2" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>

          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/signup">Signup</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/login">
                <span style={{color: '#667eea', fontWeight: 'bold'}}>Admin</span>
              </NavLink>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}