"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a fire-and-forget POST /api/posts/:id/view on first render.
 * The backend deduplicates via Redis (24 h per IP per post).
 * Does NOT affect page rendering — renders nothing.
 */
export default function ViewTracker({ postId }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !postId) return;
    fired.current = true;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${API_BASE}/posts/${postId}/view`, {
      method:      "POST",
      credentials: "include",
    }).catch(() => {}); // silent — never block the user
  }, [postId]);

  return null;
}
