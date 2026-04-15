"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin, getMe } from "@/module/auth/authService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER ON APP START
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe(); // ✅ no token needed
        setUser(data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (credentials) => {
    try {
      // ✅ login → backend sets cookie
      await loginAdmin(credentials);

      // ✅ get user using cookie
      const me = await getMe();
      setUser(me.user);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ send cookie
      });
    } catch (err) {}

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);