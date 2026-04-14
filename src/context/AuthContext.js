"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { loginAdmin, getMe } from "@/module/auth/authService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);   // ← FIX 2: add loading
  const loginDone = useRef(false);                 // ← FIX 3: block race condition

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe();
        // Only apply if login() hasn't already set the user
        if (!loginDone.current) {
          setUser(data.user || null);
        }
      } catch (err) {
        if (!loginDone.current) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginAdmin(credentials);
      const userData = data.user || data.admin || null;
      if (userData) {
        loginDone.current = true;        // block getMe() from overwriting
        setLoading(false);               // stop spinner immediately
        setUser(userData);
        if (data.token) {
          localStorage.setItem("admin_token", data.token); // ← FIX 3: cookie fallback
        }
      }
      return { success: !!userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      loginDone.current = false;
      localStorage.removeItem("admin_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);