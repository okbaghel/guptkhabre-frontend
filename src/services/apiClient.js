const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = async (url, options = {}) => {
  // Read token from localStorage (fallback when cross-domain cookie is blocked)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // ← sends token as header
      ...options.headers,
    },
    credentials: "include", // still try cookie too
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(data.msg || "API Error");
    error.status = res.status;
    throw error;
  }

  return data;
};