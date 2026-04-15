import { apiClient } from "@/services/apiClient";

// 🔐 LOGIN
export const loginAdmin = async (credentials) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// 👤 GET USER
export const getMe = async () => {
  return apiClient("/auth/me", {
    method: "GET",
  });
};