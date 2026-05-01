"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (!id) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setPost(data.post || data))
      .catch((err) => setError(err.message || "Failed to load article"))
      .finally(() => setLoading(false));
  }, [id]);





  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.heading || post?.title || "";
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Article page — uses global CSS vars set by Navbar/ThemeApplier ── */

        .nd-page {
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          padding-bottom: 100px;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .nd-container {
          max-width: 780px;
          margin: 0 auto;
          padding: 28px 20px 0;
        }

        /* ── Back button ── */
        .nd-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: 1px solid var(--border-glass);
          border-radius: 10px;
          padding: 8px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-soft);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          text-decoration: none;
          margin-bottom: 28px;
        }
        .nd-back:hover {
          border-color: var(--border-red);
          color: var(--red);
          background: var(--red-soft);
        }

        /* ── Media ── */
        .nd-media {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: var(--bg-surface);
          margin-bottom: 32px;
          border: 1px solid var(--border-hair);
        }
        .nd-media img {
          width: 100%;
          height: auto;
          display: block;
        }
        .nd-media video {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ── Meta row (badge + time) ── */
        .nd-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .nd-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: var(--red-soft);
          border: 1px solid var(--border-red);
          color: var(--red-bright);
        }
        .nd-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--red-bright);
          animation: nd-pulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes nd-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.6); }
        }
        .nd-time {
          font-size: 12.5px;
          color: var(--text-muted);
        }

        /* ── Heading ── */
        .nd-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 5vw, 40px);
          line-height: 1.22;
          color: var(--text-primary);
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }

        /* ── Subheading ── */
        .nd-subheading {
          font-size: clamp(14px, 2.4vw, 17px);
          font-weight: 400;
          color: var(--text-soft);
          line-height: 1.65;
          margin-bottom: 26px;
          font-style: italic;
          border-left: 3px solid var(--red);
          padding-left: 14px;
          opacity: 0.9;
        }

        /* ── Red divider line ── */
        .nd-rule {
          height: 1px;
          background: linear-gradient(90deg, var(--red-dim, var(--red)), transparent);
          margin-bottom: 26px;
          opacity: 0.35;
        }

        /* ── Body / description ── */
        .nd-body {
          font-size: clamp(15px, 2.2vw, 17px);
          line-height: 1.88;
          color: var(--text-soft);
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* ── Fallback title (when no heading/description) ── */
        .nd-fallback-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 4.5vw, 36px);
          line-height: 1.25;
          color: var(--text-primary);
        }

        /* ── Caption box (title as source) ── */
        .nd-caption-box {
          margin-top: 30px;
          padding: 14px 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-hair);
          border-radius: 12px;
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .nd-caption-box strong {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--red-bright);
          margin-bottom: 5px;
        }

        /* ── Bottom actions ── */
        .nd-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid var(--border-hair);
        }
        .nd-share-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid var(--border-glass);
          background: var(--bg-surface);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s;
        }
        .nd-share-btn:hover {
          border-color: var(--border-red);
          color: var(--red-bright);
          background: var(--red-soft);
        }
        .nd-share-btn.nd-copied {
          border-color: rgba(34,197,94,0.4);
          color: #22c55e;
          background: rgba(34,197,94,0.08);
        }

        /* ── Skeleton loader ── */
        .nd-skel {
          background: var(--bg-surface);
          border-radius: 8px;
          animation: nd-shine 1.5s ease-in-out infinite alternate;
        }
        @keyframes nd-shine {
          from { opacity: 1; }
          to   { opacity: 0.35; }
        }

        /* ── Error state ── */
        .nd-error {
          text-align: center;
          padding: 60px 20px;
        }
        .nd-error-emoji {
          font-size: 44px;
          margin-bottom: 16px;
          display: block;
        }
        .nd-error h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .nd-error p {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 22px;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .nd-container { padding: 16px 14px 0; }
          .nd-media { border-radius: 10px; margin-bottom: 20px; }
          .nd-actions { margin-top: 24px; padding-top: 18px; }
        }
      `}</style>

      <div className="nd-page">
        <div className="nd-container">

          {/* Back */}
          <button className="nd-back" onClick={() => router.back()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>

          {/* Skeleton while loading */}
          {loading && (
            <>
              <div className="nd-skel" style={{ height: 300, marginBottom: 28 }} />
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div className="nd-skel" style={{ height: 24, width: 100 }} />
                <div className="nd-skel" style={{ height: 24, width: 70 }} />
              </div>
              <div className="nd-skel" style={{ height: 40, width: "88%", marginBottom: 12 }} />
              <div className="nd-skel" style={{ height: 22, width: "72%", marginBottom: 24 }} />
              <div className="nd-skel" style={{ height: 16, marginBottom: 10 }} />
              <div className="nd-skel" style={{ height: 16, marginBottom: 10 }} />
              <div className="nd-skel" style={{ height: 16, width: "65%", marginBottom: 10 }} />
            </>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="nd-error">
              <span className="nd-error-emoji">📰</span>
              <h2>Could Not Load Article</h2>
              <p>The article could not be found or the server is temporarily unavailable.</p>
              <button className="nd-back" onClick={() => router.push("/")}>
                Back to Home
              </button>
            </div>
          )}

          {/* Article content */}
          {post && !loading && (
            <>
              {/* Media */}
              {post.mediaUrl && (
                <div className="nd-media">
                  {post.mediaType === "image" ? (
                    <img src={post.mediaUrl} alt={post.heading || post.title || "Article"} />
                  ) : (
                    <video src={post.mediaUrl} controls playsInline preload="metadata" />
                  )}
                </div>
              )}

              {/* Badge + time */}
              <div className="nd-meta">
                <span className="nd-badge">
                  <span className="nd-dot" />
                  GuptKhabre
                </span>
                <span className="nd-time">{timeAgo(post.createdAt)}</span>
              </div>

              {/* Heading */}
              {post.heading ? (
                <h1 className="nd-heading">{post.heading}</h1>
              ) : (
                <h1 className="nd-fallback-title">{post.title}</h1>
              )}

              {/* Subheading */}
              {post.subheading && (
                <p className="nd-subheading">{post.subheading}</p>
              )}

              {/* Divider when we have rich content */}
              {(post.heading || post.subheading) && post.description && (
                <div className="nd-rule" />
              )}

              {/* Description / body */}
              {post.description && (
                <div className="nd-body">{post.description}</div>
              )}

              {/* Title caption — only show when heading exists */}
              {post.heading && post.title && (
                <div className="nd-caption-box">
                  <strong>Caption</strong>
                  {post.title}
                </div>
              )}

              {/* Actions */}
              <div className="nd-actions">
                <button
                  className={`nd-share-btn${copied ? " nd-copied" : ""}`}
                  onClick={handleShare}
                >
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Share Article
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
