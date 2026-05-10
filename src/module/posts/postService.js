import { apiClient } from "@/services/apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ── Public ────────────────────────────────────────────────────────────────────

export const getPosts = async () => {
  const data = await apiClient("/posts");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.posts)) return data.posts;
  return [];
};

export const getPostById = async (id) => {
  const data = await apiClient(`/posts/${id}`);
  return data.post || data;
};

// ── Admin ─────────────────────────────────────────────────────────────────────

/**
 * Paginated posts for the admin table — uses the dedicated admin endpoint
 * that returns total count for proper numbered pagination.
 * @param {{ page?: number, limit?: number, search?: string }} params
 * @returns {{ posts: Post[], total: number, page: number, totalPages: number }}
 */
export const getAdminPosts = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const params = new URLSearchParams({
    page:  String(page),
    limit: String(limit),
    ...(search.trim() && { search: search.trim() }),
  });

  const data = await apiClient(`/posts/admin/list?${params}`);

  return {
    posts:      Array.isArray(data.posts) ? data.posts : [],
    total:      data.total      ?? 0,
    page:       data.page       ?? page,
    totalPages: data.totalPages ?? 1,
  };
};

/**
 * Delete a post by ID.
 */
export const deletePost = async (id) => {
  return apiClient(`/posts/${id}`, { method: "DELETE" });
};

/**
 * Create a new post (multipart FormData — bypasses apiClient JSON header).
 */
export const createPost = async (formData) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method:      "POST",
    body:        formData,
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

/**
 * Update a post by ID (multipart FormData).
 * Supports: title, heading, subheading, description (rich HTML), file.
 */
export const updatePost = async (id, formData) => {
  // API_BASE already contains /api — path is /posts/:id (no double /api/)
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method:      "PUT",
    body:        formData,
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
 * Track a post view (fire-and-forget helper used by ViewTracker component).
 */
export const trackPostView = async (id) => {
  return fetch(`${API_BASE}/posts/${id}/view`, {
    method:      "POST",
    credentials: "include",
  }).catch(() => {});
};
