"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin, getMe, logoutAdmin } from "@/module/auth/authService";

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
      const data = await getMe();
      setUser(data.user || null);
    } catch {
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
    setUser(data.user);
    document.cookie = "admin_auth=1; path=/; max-age=604800; samesite=lax";

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
    await logoutAdmin();
  } catch {}
  document.cookie = "admin_auth=; path=/; max-age=0; samesite=lax";
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