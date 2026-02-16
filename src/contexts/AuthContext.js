import React, { createContext, useState, useContext, useEffect } from "react";
import db from "../db/indexedDB";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const SESSION_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Check Auth On App Start
  // =========================
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const stored = localStorage.getItem("adminUser");

      if (!stored) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(stored);

      // ✅ Check session expiry
      if (!parsedUser.loginTime || Date.now() - parsedUser.loginTime > SESSION_TIME) {
        console.log("Session expired");
        localStorage.removeItem("adminUser");
        setLoading(false);
        return;
      }

      // ✅ Validate user still exists in IndexedDB
      const users = await db.getByIndex("users", "email", parsedUser.email);

      if (users && users.length > 0) {
        setCurrentUser(parsedUser);
      } else {
        console.log("User not found in DB");
        localStorage.removeItem("adminUser");
      }

    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("adminUser");
    }

    setLoading(false);
  };

  // =========================
  // Login
  // =========================
  const login = async (email, password) => {
    try {
      const users = await db.getByIndex("users", "email", email);

      const user = users.find(
        (u) => u.password === password && u.role === "admin"
      );

      if (!user) {
        return {
          success: false,
          error: "Invalid credentials or not admin",
        };
      }

      const { password: _, ...safeUser } = user;

      const sessionUser = {
        ...safeUser,
        loginTime: Date.now(),
      };

      setCurrentUser(sessionUser);
      localStorage.setItem("adminUser", JSON.stringify(sessionUser));

      return { success: true };

    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // =========================
  // Logout
  // =========================
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("adminUser");
  };

  // =========================
  // Context Value
  // =========================
  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAdmin: currentUser?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
