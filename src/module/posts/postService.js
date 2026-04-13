import { apiClient } from "@/services/apiClient";

// ── Public ────────────────────────────────────────────────────────────────────

export const getPosts = async () => {
  const data = await apiClient("/posts");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.posts)) return data.posts;
  return [];
};

// ── Admin ─────────────────────────────────────────────────────────────────────

/**
 * Paginated posts for admin table
 * @param {{ page?: number, limit?: number, search?: string }} params
 * @returns {{ posts: Post[], total: number, page: number, totalPages: number }}
 */
export const getAdminPosts = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search.trim() && { search: search.trim() }),
  });

  const data = await apiClient(`/posts?${params}`);

  // Normalize various response shapes
  if (Array.isArray(data)) {
    return { posts: data, total: data.length, page, totalPages: 1 };
  }

  return {
    posts:      Array.isArray(data.posts) ? data.posts : [],
    total:      data.total      ?? data.count ?? 0,
    page:       data.page       ?? page,
    totalPages: data.totalPages ?? data.pages ?? 1,
  };
};

/**
 * Delete a post by ID
 */
export const deletePost = async (id) => {
  return await apiClient(`/posts/${id}`, { method: "DELETE" });
};

/**
 * Update a post by ID
 */
export const updatePost = async (id, { title, file }) => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const formData = new FormData();

  if (title) formData.append("title", title);
  if (file) formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.msg || "Update failed");
    err.status = res.status;
    throw err;
  }

  return data;
};

/**
 * Create a new post (multipart — bypass apiClient JSON headers)
 */
export const createPost = async (formData) => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    body: formData,           // let browser set multipart boundary
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.msg || "Upload failed");
    err.status = res.status;
    throw err;
  }
  return data;
};