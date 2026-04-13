import { apiClient } from "@/services/apiClient";

// ✅ CREATE CONTACT (user form submit)
export const createContact = async (formData) => {
  return apiClient("/contact", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

// ✅ GET ALL CONTACTS (admin)
export const getAllContacts = async () => {
  return apiClient("/contact");
};

// ✅ UPDATE STATUS (admin)
export const updateContactStatus = async (id, status) => {
  return apiClient(`/contact/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};