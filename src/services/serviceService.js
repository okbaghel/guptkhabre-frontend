import { apiClient } from "@/services/apiClient";

// 🔥 GET SERVICES
export const getServices = async () => {
  const data = await apiClient("/services");

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.services)) return data.services;

  return [];
};

// 🔥 DELETE SERVICE
export const deleteService = async (id) => {
  return await apiClient(`/services/${id}`, {
    method: "DELETE",
  });
};


export const updateService = async (id, { name, profile, description, mobile, whatsapp, file, isActive }) => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const formData = new FormData();

  if (name) formData.append("name", name);
  if (profile) formData.append("profile", profile);
  if (description) formData.append("description", description);
  if (mobile) formData.append("mobile", mobile);
  if (whatsapp) formData.append("whatsapp", whatsapp);

  // 🔥 important
  if (typeof isActive !== "undefined") {
    formData.append("isActive", isActive);
  }

  if (file) formData.append("file", file);

  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.msg || "Update failed");
  }

  return data;
};


/**
 * Create a new service (multipart — image upload)
 */
export const createService = async (formData) => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE}/services`, {
    method: "POST",
    body: formData,          // browser sets multipart boundary automatically
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.msg || "Failed to create service");
    err.status = res.status;
    throw err;
  }
  return data;
};