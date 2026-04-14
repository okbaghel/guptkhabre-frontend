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
        const token = localStorage.getItem("admin_token");

        if (!token) {
          setUser(null);
          return;
        }

        const data = await getMe(token);
        setUser(data.user || null);
      } catch (err) {
        localStorage.removeItem("admin_token");
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
      const data = await loginAdmin(credentials);

      if (!data.token) {
        return { success: false };
      }

      localStorage.setItem("admin_token", data.token);

      // always trust backend /me
      const me = await getMe(data.token);
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
    localStorage.removeItem("admin_token");
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