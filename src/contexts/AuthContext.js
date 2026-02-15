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

  const checkAuth = () => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  };

 const login = async (email, password) => {
  try {
    await db.init(); // Make sure DB is initialized
    const users = await db.getByIndex('users', 'email', email);
    const user = users.find(u => u.password === password && u.role === 'admin');
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials or insufficient permissions' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adminUser');
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