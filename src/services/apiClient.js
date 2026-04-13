const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = async (url, options = {}) => {


  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // ✅ send cookies
    
  });
  console.log(res);

  let data;
  try {
    data = await res.json();
    console.log(data);
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