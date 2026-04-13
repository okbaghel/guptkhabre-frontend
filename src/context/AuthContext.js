"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin, getMe } from "@/module/auth/authService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user || data.admin || null);
      } catch (err) {
        console.log("Auth error:", err.message);
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // 🔐 LOGIN
  const login = async (credentials) => {
    try {
      const data = await loginAdmin(credentials);
      setUser(data.admin || data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* ✅ NEVER block UI */}
    </AuthContext.Provider>
  );
}

// Custom Hook
export const useAuth = () => useContext(AuthContext);