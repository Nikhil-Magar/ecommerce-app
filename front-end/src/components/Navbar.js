import React, { useState, useEffect } from 'react';
import logo from './Logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './navbar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged in user
    const checkUser = () => {
      const user = localStorage.getItem('currentUser');
      const adminUser = localStorage.getItem('adminUser');
      
      if (adminUser) {
        setCurrentUser(JSON.parse(adminUser));
      } else if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        setCurrentUser(null);
      }
    };

    checkUser();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkUser);
    
    // Custom event listener for login/logout
    window.addEventListener('userChanged', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userChanged', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminUser');
    setCurrentUser(null);
    navigate('/');
    window.location.reload(); // Refresh to update auth state
  };

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

          {/* Cart Icon - Far Right */}
          <div className="cart-icon-container">
            <NavLink to="/cart" className="cart-icon-link">
              <span className="cart-icon">🛒</span>
              {getTotalItems() > 0 && (
                <span className="cart-badge-top">{getTotalItems()}</span>
              )}
            </NavLink>
          </div>

          <ul className="navbar-nav mb-2 mb-lg-0">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="nav-link user-greeting">
                    👋 Hello, {currentUser.name}
                  </span>
                </li>
                {currentUser.role === 'admin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link admin-link" to="/admin">
                      ⚙️ Admin Panel
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <button 
                    className="nav-link logout-btn" 
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">Signup</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link admin-link" to="/admin/login">
                    Admin
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}