import { apiClient } from "@/services/apiClient";

export const getStories = () => apiClient("/stories");