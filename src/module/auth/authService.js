import { apiClient } from "@/services/apiClient";

// 🔐 LOGIN ADMIN
export const loginAdmin = async (credentials) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// 👤 GET CURRENT USER
export const getMe = async () => {
  try {
    return await apiClient("/auth/me", {
      method: "GET",
    });
  } catch (err) {
    if (err.status === 401) {
      // ✅ Not logged in (normal case)
      return { user: null };
    }
    throw err;
  }
};