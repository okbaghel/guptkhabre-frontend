"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "./PostCard";

export default function PostList() {
  const [posts, setPosts]     = useState([]);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef           = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}&limit=5`
      );
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();

      setPosts((prev) => {
        const ids     = new Set(prev.map((p) => p._id));
        const newPosts = data.posts.filter((p) => !ids.has(p._id));
        return [...prev, ...newPosts];
      });
      setPage((prev) => prev + 1);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  /* initial load */
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* infinite scroll */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchPosts();
    });
    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, [fetchPosts, hasMore, loading]);

  return (
    <>
      <style jsx>{`
        .pl-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 32px;
        }

        /* ── Spinner ── */
        .gk-spinner {
          margin: 24px auto;
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 3px solid rgba(221, 0, 0, 0.18);
          border-top: 3px solid #DD0000;
          animation: gk-spin 0.75s linear infinite;
        }
        @keyframes gk-spin { to { transform: rotate(360deg); } }

        /* ── End of feed ── */
        .pl-end {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 0 40px;
        }
        .pl-end-line {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 280px;
        }
        .pl-end-rule {
          flex: 1;
          height: 1px;
          background: rgba(221, 0, 0, 0.25);
        }
        .pl-end-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #DD0000;
          flex-shrink: 0;
        }
        .pl-end-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(221, 0, 0, 0.55);
          margin-top: 4px;
        }

        /* ── Empty state ── */
        .pl-empty {
          text-align: center;
          padding: 48px 0;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          color: var(--text-muted, rgba(255,255,255,0.4));
        }
      `}</style>

      <div className="pl-list">
        {posts.length === 0 && !loading && (
          <div className="pl-empty">No posts yet.</div>
        )}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Scroll trigger sentinel */}
      <div ref={observerRef} style={{ height: "1px" }} />

      {/* Loading spinner */}
      {loading && <div className="gk-spinner" />}

      {/* End of feed */}
      {!hasMore && !loading && posts.length > 0 && (
        <div className="pl-end">
          <div className="pl-end-line">
            <div className="pl-end-rule" />
            <div className="pl-end-dot" />
            <div className="pl-end-rule" />
          </div>
          <span className="pl-end-text">You're all caught up</span>
        </div>
      )}
    </>
  );
}