import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import db from './db/indexedDB';

// Import your existing pages
import Home from './pages/Home';
import About from './pages/about';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';

// Import admin components
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';

// Import your Header component
import Header from './components/Header';

import './App.css';

// Component to conditionally show Header
// Shows on public pages (Home, About, etc.)
// Hides on admin pages (/admin/*)
const ConditionalHeader = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show header on admin pages
  if (isAdminRoute) return null;
  
  // Show header on all public pages
  return <Header />;
};

// Protected Route Component for Admin Panel
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/admin/login" />;
};

function AppContent() {
  useEffect(() => {
    // Initialize database on app start
    const initDB = async () => {
      try {
        await db.init();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initDB();
  }, []);

  return (
    <Router>
      {/* Conditional Header - Shows on public pages, hidden on /admin */}
      <ConditionalHeader />
      
      <Routes>
        {/* ========== PUBLIC ROUTES (Customer-facing) ========== */}
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* ========== ADMIN ROUTES ========== */}
        {/* Admin Login (No auth required) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Panel (Auth required) */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* ========== FALLBACK ROUTE ========== */}
        {/* Redirect any unknown routes to welcome */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;


