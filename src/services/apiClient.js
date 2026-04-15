const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = async (url, options = {}) => {


  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include", // 🔥 VERY IMPORTANT
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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