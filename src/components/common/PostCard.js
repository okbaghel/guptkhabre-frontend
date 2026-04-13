"use client";

import { useState } from "react";
import Image from "next/image";

/* ── helpers ── */
function formatCount(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

/* ── icons ── */
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? "#c9a96e" : "none"}
    stroke={filled ? "#c9a96e" : "currentColor"}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="#c9a96e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ── Share Sheet ── */
function ShareSheet({ url, title, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: "WhatsApp", color: "#25D366",
      icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
      href: `https://wa.me/?text=${encodeURIComponent((title || "") + " " + (url || ""))}`,
    },
    {
      name: "Twitter", color: "#1DA1F2",
      icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "")}&url=${encodeURIComponent(url || "")}`,
    },
    {
      name: "Telegram", color: "#0088cc",
      icon: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
      href: `https://t.me/share/url?url=${encodeURIComponent(url || "")}&text=${encodeURIComponent(title || "")}`,
    },
  ];

  return (
    <div className="gk-backdrop" onClick={onClose}>
      <div className="gk-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="gk-handle" />
        <p className="gk-sheet-title">Share Post</p>
        <div className="gk-platforms">
          {platforms.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="gk-plat">
              <div className="gk-plat-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill={p.color}>
                  <path d={p.icon} />
                </svg>
              </div>
              <span>{p.name}</span>
            </a>
          ))}
        </div>
        <button className="gk-copy" onClick={copy}>
          {copied ? "✓  Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

/* ── PostCard ── */
export default function PostCard({ post = {}, onLike }) {
  const [liked, setLiked]         = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showShare, setShowShare] = useState(false);
  const [showFull, setShowFull]   = useState(false);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : c - 1));
    onLike?.(post._id, next);
  };

  const caption   = post.title || "";
  const isLong    = caption.length > 110;
  const displayed = isLong && !showFull ? caption.slice(0, 110) + "…" : caption;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:wght@600&display=swap');

        :root {
          --gk-gold:    #c9a96e;
          --gk-gold-d:  rgba(201,169,110,0.13);
          --gk-bg:      #111118;
          --gk-bg2:     #1a1a22;
          --gk-border:  rgba(255,255,255,0.08);
          --gk-text:    #f0ede8;
          --gk-muted:   rgba(240,237,232,0.42);
        }

        /* Card */
        .gk-card {
          font-family: 'DM Sans', sans-serif;
          background: var(--gk-bg);
          border-radius: 16px;
          overflow: hidden;
          border: 0.5px solid var(--gk-border);
          width: 100%;
        }

        /* Mobile: full bleed */
        @media (max-width: 520px) {
          .gk-card {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }

        /* Header */
        .gk-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
        }

        .gk-ring {
          width: 38px; height: 38px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, #c9a96e, #f0e0b8, #b8893e);
          flex-shrink: 0;
        }

        .gk-ring-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: var(--gk-bg2);
          border: 2px solid var(--gk-bg);
          display: flex; align-items: center; justify-content: center;
        }

        .gk-initial {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px; font-weight: 600;
          color: var(--gk-gold); line-height: 1;
        }

        .gk-info { flex: 1; min-width: 0; }

        .gk-name {
          display: flex; align-items: center; gap: 4px;
          font-size: 13.5px; font-weight: 500;
          color: var(--gk-text); letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .gk-meta {
          font-size: 11px; color: var(--gk-muted);
          margin-top: 2px; letter-spacing: 0.02em;
        }

        /* Media — natural size, full width */
        .gk-media {
          width: 100%;
          background: #000;
          line-height: 0;
          display: block;
        }

        .gk-media img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .gk-media video {
          width: 100%;
          height: auto;
          display: block;
          background: #000;
        }

        /* Actions */
        .gk-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px 8px;
        }

        .gk-btn {
          display: flex; align-items: center; gap: 6px;
          background: none;
          border: 0.5px solid var(--gk-border);
          color: var(--gk-muted);
          padding: 7px 15px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: color .15s, background .15s, border-color .15s, transform .12s;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .gk-btn:hover {
          color: var(--gk-text);
          background: var(--gk-gold-d);
          border-color: rgba(201,169,110,0.28);
        }

        .gk-btn:active { transform: scale(0.91); }

        .gk-btn.liked {
          color: var(--gk-gold);
          background: var(--gk-gold-d);
          border-color: rgba(201,169,110,0.3);
        }

        /* Caption */
        .gk-caption {
          padding: 2px 14px 14px;
          font-size: 13.5px;
          color: var(--gk-text);
          line-height: 1.6;
          letter-spacing: 0.01em;
        }

        .gk-caption b { font-weight: 500; margin-right: 5px; }

        .gk-more {
          background: none; border: none;
          color: var(--gk-muted); font-size: 13px;
          cursor: pointer; padding: 0;
          font-family: inherit;
        }

        /* Share sheet */
        .gk-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(5px);
          display: flex; align-items: flex-end; justify-content: center;
        }

        .gk-sheet {
          background: #18181f;
          border: 0.5px solid rgba(201,169,110,0.14);
          border-radius: 24px 24px 0 0;
          width: 100%; max-width: 560px;
          padding: 16px 20px 38px;
          animation: sheetUp .24s cubic-bezier(.32,.72,0,1);
        }

        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .gk-handle {
          width: 36px; height: 3px;
          border-radius: 100px;
          background: rgba(255,255,255,0.11);
          margin: 0 auto 16px;
        }

        .gk-sheet-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600;
          color: var(--gk-text); letter-spacing: 0.02em;
          text-align: center; margin-bottom: 20px;
        }

        .gk-platforms {
          display: flex; justify-content: space-around;
          margin-bottom: 18px;
        }

        .gk-plat {
          display: flex; flex-direction: column;
          align-items: center; gap: 7px;
          text-decoration: none;
          color: var(--gk-muted);
          font-size: 11px; letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
          transition: color .15s;
        }

        .gk-plat:hover { color: var(--gk-text); }

        .gk-plat-icon {
          width: 54px; height: 54px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          transition: background .15s;
        }

        .gk-plat:hover .gk-plat-icon { background: rgba(255,255,255,0.09); }

        .gk-copy {
          width: 100%; padding: 13px;
          border-radius: 13px;
          background: var(--gk-gold-d);
          border: 0.5px solid rgba(201,169,110,0.26);
          color: var(--gk-gold);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          letter-spacing: 0.05em; cursor: pointer;
          transition: background .18s, border-color .18s;
        }

        .gk-copy:hover {
          background: rgba(201,169,110,0.22);
          border-color: rgba(201,169,110,0.46);
        }
      `}</style>

      <article className="gk-card">

        {/* Header */}
        <div className="gk-header">
  <div className="gk-ring">
    <div className="gk-ring-inner">
      <Image
        src="/logo.png"
        alt="Guptkhabre"
        width={34}
        height={34}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  </div>

  <div className="gk-info">
    <div className="gk-name">
      <span>Guptkhabre</span>
    </div>

    <div className="gk-meta">
      {post.category && <>{post.category} · </>}
      {timeAgo(post.createdAt)}
    </div>
  </div>
</div>

        {/* Media — natural size exactly like original */}
        <div className="gk-media">
          {post.mediaType === "image" ? (
            <img
              src={post.mediaUrl}
              alt={post.title || "Post image"}
              width="100%"
              height="auto"
            />
          ) : (
            <video
              src={post.mediaUrl}
              controls
              playsInline
              preload="metadata"
            />
          )}
        </div>

        {/* Actions */}
        <div className="gk-actions">
          

          <button
            className="gk-btn"
            onClick={() => setShowShare(true)}
            aria-label="Share"
          >
            <ShareIcon />
            <span>Share</span>
          </button>
        </div>

        {/* Caption */}
        {caption && (
          <div className="gk-caption">
            <b>{post.author?.name || "Admin"}</b>
            {displayed}
            {isLong && (
              <button className="gk-more" onClick={() => setShowFull((v) => !v)}>
                {showFull ? " less" : " more"}
              </button>
            )}
          </div>
        )}

      </article>

      {showShare && (
        <ShareSheet
          url={post.shareUrl || (typeof window !== "undefined" ? window.location.href : "")}
          title={post.title}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}