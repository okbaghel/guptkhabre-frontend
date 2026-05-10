import { notFound } from "next/navigation";
import Link from "next/link";
import ShareButton from "./ShareButton";
import ViewTracker from "@/components/common/ViewTracker";

// Cache each article for 60 s on the Next.js data cache (Vercel ISR).
// The backend Redis layer gives us another cache hit before MongoDB is touched.
export const revalidate = 60;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

async function getPost(id) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post || data;
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ params }) {
  const { id } = await params; // params is a Promise in Next.js 15

  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) notFound();

  const post = await getPost(id);
  if (!post) notFound();

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/news/${id}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── CSS variable definitions so the page looks right on first paint ── */
        :root {
          --bg-base:      #0a0a0a;
          --bg-surface:   #111111;
          --text-primary: #ffffff;
          --text-soft:    rgba(255,255,255,0.82);
          --text-muted:   rgba(255,255,255,0.45);
          --border-glass: rgba(255,255,255,0.08);
          --border-hair:  rgba(255,255,255,0.06);
          --border-red:   rgba(221,0,0,0.30);
          --red:          #DD0000;
          --red-bright:   #FF2E2E;
          --red-soft:     rgba(221,0,0,0.08);
          --red-dim:      rgba(221,0,0,0.40);
        }
        [data-gk-theme="light"] {
          --bg-base:      #f5f5f7;
          --bg-surface:   #ffffff;
          --text-primary: #0a0a0a;
          --text-soft:    rgba(0,0,0,0.80);
          --text-muted:   rgba(0,0,0,0.45);
          --border-glass: rgba(0,0,0,0.08);
          --border-hair:  rgba(0,0,0,0.06);
          --border-red:   rgba(221,0,0,0.30);
          --red-soft:     rgba(221,0,0,0.06);
          --red-dim:      rgba(221,0,0,0.35);
        }

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
        .nd-media img, .nd-media video {
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
        .nd-time { font-size: 12.5px; color: var(--text-muted); }

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

        /* ── Red divider ── */
        .nd-rule {
          height: 1px;
          background: linear-gradient(90deg, var(--red-dim, var(--red)), transparent);
          margin-bottom: 26px;
          opacity: 0.35;
        }

        /* ── Body ── */
        .nd-body {
          font-size: clamp(15px, 2.2vw, 17px);
          line-height: 1.88;
          color: var(--text-soft);
          word-break: break-word;
        }

        /* ── Rich-content typography (Tiptap HTML output) ── */
        .nd-rich-content h1,
        .nd-rich-content h2,
        .nd-rich-content h3,
        .nd-rich-content h4 {
          font-family: 'DM Serif Display', serif;
          color: var(--text-primary);
          line-height: 1.25;
          margin: 1.5em 0 0.5em;
        }
        .nd-rich-content h1 { font-size: clamp(22px, 4vw, 32px); }
        .nd-rich-content h2 { font-size: clamp(19px, 3.5vw, 27px); }
        .nd-rich-content h3 { font-size: clamp(17px, 3vw, 22px); }
        .nd-rich-content h4 { font-size: clamp(15px, 2.5vw, 18px); }
        .nd-rich-content p  { margin: 0 0 1.1em; }
        .nd-rich-content strong { font-weight: 700; color: var(--text-primary); }
        .nd-rich-content em     { font-style: italic; opacity: 0.9; }
        .nd-rich-content u      { text-decoration: underline; }
        .nd-rich-content s      { text-decoration: line-through; opacity: 0.6; }
        .nd-rich-content mark {
          background: rgba(250, 204, 21, 0.25);
          color: var(--text-primary);
          border-radius: 3px;
          padding: 0 3px;
        }
        .nd-rich-content a {
          color: var(--red-bright);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.15s;
        }
        .nd-rich-content a:hover { opacity: 0.75; }
        .nd-rich-content ul,
        .nd-rich-content ol {
          padding-left: 1.6em;
          margin: 0.6em 0 1.1em;
        }
        .nd-rich-content ul { list-style: disc; }
        .nd-rich-content ol { list-style: decimal; }
        .nd-rich-content li { margin-bottom: 0.35em; }
        .nd-rich-content blockquote {
          border-left: 3px solid var(--red);
          margin: 1.4em 0;
          padding: 0.6em 0 0.6em 1.1em;
          color: var(--text-muted);
          font-style: italic;
        }
        .nd-rich-content code {
          font-family: 'Courier New', monospace;
          font-size: 0.88em;
          background: rgba(255,255,255,0.07);
          border: 1px solid var(--border-glass);
          border-radius: 4px;
          padding: 1px 5px;
        }
        .nd-rich-content pre {
          background: #0d0d0d;
          border: 1px solid var(--border-glass);
          border-radius: 10px;
          padding: 16px 18px;
          overflow-x: auto;
          margin: 1.2em 0;
        }
        .nd-rich-content pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.86em;
          color: #e2e8f0;
        }
        .nd-rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 1em 0;
          display: block;
        }
        [data-gk-theme="light"] .nd-rich-content code {
          background: rgba(0,0,0,0.06);
        }
        [data-gk-theme="light"] .nd-rich-content pre {
          background: #1e1e2e;
        }

        /* ── Fallback title ── */
        .nd-fallback-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 4.5vw, 36px);
          line-height: 1.25;
          color: var(--text-primary);
        }

        /* ── Caption box ── */
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

        @media (max-width: 600px) {
          .nd-container { padding: 16px 14px 0; }
          .nd-media { border-radius: 10px; margin-bottom: 20px; }
          .nd-actions { margin-top: 24px; padding-top: 18px; }
        }
      `}</style>

      <div className="nd-page">
        <div className="nd-container">

          {/* Back — plain <Link> so no client JS needed */}
          <Link href="/" className="nd-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>

          {/* Media */}
          {post.mediaUrl && (
            <div className="nd-media">
              {post.mediaType === "image" ? (
                <img
                  src={post.mediaUrl}
                  alt={post.heading || post.title || "Article"}
                  loading="eager"
                />
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

          {/* Divider */}
          {(post.heading || post.subheading) && post.description && (
            <div className="nd-rule" />
          )}

          {/* Body — rendered as rich HTML from Tiptap */}
          {post.description && (
            <div
              className="nd-body nd-rich-content"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          )}

          {/* View tracker — fire-and-forget, renders nothing */}
          <ViewTracker postId={post._id} />

          {/* Caption box */}
          {post.heading && post.title && (
            <div className="nd-caption-box">
              <strong>Caption</strong>
              {post.title}
            </div>
          )}

          {/* Actions */}
          <div className="nd-actions">
            <ShareButton url={pageUrl} title={post.heading || post.title || ""} />
          </div>

        </div>
      </div>
    </>
  );
}
