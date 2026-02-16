import React, { createContext, useState, useContext, useEffect } from 'react';
import db from '../db/indexedDB';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Wait for database to be initialized by App.js
      let retries = 0;
      while (!db.db && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }

      // If still not initialized, try to initialize
      if (!db.db) {
        await db.init();
      }

      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Verify user still exists in database and is active
        const users = await db.getByIndex('users', 'email', user.email);
        const validUser = users.find(u => u.role === 'admin' && u.status === 'active');
        
        if (validUser) {
          const { password, ...userWithoutPassword } = validUser;
          setCurrentUser(userWithoutPassword);
        } else {
          // User no longer valid, clear localStorage
          localStorage.removeItem('adminUser');
          setCurrentUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // If auth check fails, just clear and continue
      localStorage.removeItem('adminUser');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Initialize database if needed
      if (!db.db) {
        await db.init();
      }

      const users = await db.getByIndex('users', 'email', email);
      const user = users.find(u => u.password === password && u.role === 'admin');
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
        
        // Force redirect after successful login
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
        
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials or insufficient permissions' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAdmin: currentUser?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};