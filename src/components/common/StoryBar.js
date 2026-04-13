"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from 'next/link';

/* ─────────────────────────────────────────────
   STORY VIEWER  (full-screen, Instagram-style)
───────────────────────────────────────────── */
function StoryViewer({ stories, startIndex, onClose }) {
  const [current, setCurrent]   = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);
  const timerRef  = useRef(null);
  const startRef  = useRef(null);
  const touchRef  = useRef(null);
  const DURATION  = 5000; // ms per story

  const story = stories[current];

  /* advance to next or close */
const goNext = useCallback(() => {
  if (current < stories.length - 1) {
    setCurrent((p) => p + 1);
    setProgress(0);
  } else {
    setTimeout(() => onClose(), 0); // ✅ safe
  }
}, [current, stories.length, onClose]);

  const goPrev = () => {
    if (current > 0) {
      setCurrent((p) => p - 1);
      setProgress(0);
    }
  };

  /* progress ticker */
  useEffect(() => {
    if (paused) return;
    const step = 100 / (DURATION / 50);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
       if (p >= 100) {
  setTimeout(() => goNext(), 0); // ✅ defer
  return 0;
}
        return p + step;
      });
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [current, paused, goNext]);

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, onClose]);

  /* touch swipe */
  const onTouchStart = (e) => {
    touchRef.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e) => {
    setPaused(false);
    if (!touchRef.current) return;
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    touchRef.current = null;
  };

  /* tap zone: left 33% = prev, right 33% = next, middle = pause */
  const onTap = (e) => {
    const x = e.clientX / window.innerWidth;
    if (x < 0.33) goPrev();
    else if (x > 0.67) goNext();
  };

  if (!story) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@600;700&display=swap');

        .sv-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: #000;
          display: flex; align-items: center; justify-content: center;
          animation: sv-fadein 0.18s ease;
        }
        @keyframes sv-fadein { from { opacity:0 } to { opacity:1 } }

        .sv-container {
          position: relative;
          width: 100%; max-width: 420px; height: 100svh;
          overflow: hidden;
          background: #111;
          border-radius: 0;
        }
        @media (min-width: 500px) {
          .sv-container { height: min(92svh, 780px); border-radius: 14px; }
        }

        /* media */
        .sv-media {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          user-select: none; pointer-events: none;
        }

        /* gradient overlays */
        .sv-top-fade {
          position: absolute; top: 0; left: 0; right: 0; height: 140px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%);
          pointer-events: none; z-index: 2;
        }
        .sv-bot-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 160px;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
          pointer-events: none; z-index: 2;
        }

        /* progress bars */
        .sv-bars {
          position: absolute; top: 10px; left: 12px; right: 12px;
          display: flex; gap: 4px; z-index: 10;
        }
        .sv-bar {
          flex: 1; height: 2.5px; border-radius: 2px;
          background: rgba(255,255,255,0.28); overflow: hidden;
        }
        .sv-bar-fill {
          height: 100%; border-radius: 2px;
          background: #fff;
          transition: width 0.05s linear;
        }

        /* header */
        .sv-header {
          position: absolute; top: 22px; left: 12px; right: 12px;
          display: flex; align-items: center; justify-content: space-between;
          z-index: 10;
        }
        .sv-author {
          display: flex; align-items: center; gap: 9px;
        }
        .sv-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #DD0000;
          object-fit: cover; flex-shrink: 0;
          background: #222;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .sv-avatar-initials {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #fff;
        }
        .sv-author-info { display: flex; flex-direction: column; gap: 1px; }
        .sv-author-name {
          font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 700; color: #fff;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .sv-time {
          font-family: 'Barlow', sans-serif;
          font-size: 10.5px; font-weight: 400;
          color: rgba(255,255,255,0.60);
        }
        .sv-close {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.4);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; line-height: 1;
          transition: background 0.15s;
        }
        .sv-close:hover { background: rgba(221,0,0,0.7); }

        .sv-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 160px; /* 👈 important for spacing */
  justify-content: flex-end; /* 👈 push button to bottom */
  z-index: 10;
}

        /* caption */
 .sv-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto; /* 👈 THIS pushes it to bottom */
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px;
  color: #fff;
  padding: 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s;
}

.sv-link-btn:hover {
  background: rgba(255,255,255,0.25);
}
        .sv-caption {
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 500; color: #fff;
          line-height: 1.5;
          text-shadow: 0 1px 6px rgba(0,0,0,0.6);
        }
        .sv-counter {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.45); text-transform: uppercase;
          margin-top: 6px;
        }

        /* tap zones (invisible) */
        .sv-tap-prev, .sv-tap-next {
          position: absolute; top: 0; bottom: 0; width: 33%; z-index: 5;
          cursor: pointer;
        }
        .sv-tap-prev { left: 0; }
        .sv-tap-next { right: 0; }

        /* pause overlay */
        .sv-tap-mid {
          position: absolute; top: 0; bottom: 0; left: 33%; right: 33%; z-index: 5;
          cursor: pointer;
        }
      `}</style>

      <div className="sv-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div
          className="sv-container"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Media */}
          {story.mediaType === "video" ? (
            <video
              key={story._id}
              className="sv-media"
              src={story.mediaUrl}
              autoPlay muted playsInline
            />
          ) : (
            <img
              key={story._id}
              className="sv-media"
              src={story.mediaUrl || "/placeholder-story.jpg"}
              alt={story.caption || "Story"}
              draggable={false}
            />
          )}

          <div className="sv-top-fade" />
          <div className="sv-bot-fade" />

          {/* Progress bars */}
          <div className="sv-bars">
            {stories.map((_, i) => (
              <div key={i} className="sv-bar">
                <div
                  className="sv-bar-fill"
                  style={{
                    width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="sv-header">
            <div className="sv-author">
              <div className="sv-avatar">
                {story.author?.avatar ? (
                  <img src={story.author.avatar} alt={story.author.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span className="sv-avatar-initials">
                    {(story.author?.name || "A").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="sv-author-info">
                <span className="sv-author-name">{story.author?.name || "Admin"}</span>
                <span className="sv-time">{timeAgo(story.createdAt)}</span>
              </div>
            </div>
            <button className="sv-close" onClick={onClose}>×</button>
          </div>

          {/* Tap zones */}
          <div className="sv-tap-prev" onClick={goPrev} />
          <div
            className="sv-tap-mid"
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
          />
          <div className="sv-tap-next" onClick={goNext} />

          {/* Footer */}
         <div className="sv-footer">
  {story.caption && <p className="sv-caption">{story.caption}</p>}

  {/* ✅ ADD THIS LINK BUTTON */}
  {story.link && (
    <Link
      href={story.link}
      target="_blank"
      rel="noreferrer"
      className="sv-link-btn"
      onClick={(e) => e.stopPropagation()}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      Visit Link →
    </Link>
  )}

  <p className="sv-counter">{current + 1} / {stories.length}</p>
</div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   STORY BAR  (horizontal strip)
───────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function StoryBar() {
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [viewerIdx, setViewerIdx] = useState(null); // null = closed
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stories`);
        if (!res.ok) throw new Error("Stories fetch failed");
        const data = await res.json();
        setStories(data.stories || data);
      } catch (err) {
        console.error("Stories error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (!loading && stories.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@600;700&display=swap');

        :root {
          --red:        #DD0000;
          --red-bright: #FF2E2E;
        }
        [data-gk-theme="light"] {
          --sb-bg:      #F5F5F5;
          --sb-name:    #0a0a0a;
          --sb-muted:   rgba(0,0,0,0.45);
        }
        [data-gk-theme="dark"], :root {
          --sb-bg:      #111111;
          --sb-name:    #FFFFFF;
          --sb-muted:   rgba(255,255,255,0.45);
        }

        .sb-root {
          overflow-x: auto;
          padding: 14px 0 10px;
          scrollbar-width: none;
        }
        .sb-root::-webkit-scrollbar { display: none; }

        .sb-track {
          display: flex;
          gap: 14px;
          padding: 0 4px;
          min-width: max-content;
        }

        /* single story bubble */
        .sb-item {
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; cursor: pointer; flex-shrink: 0;
          transition: transform 0.15s ease;
        }
        .sb-item:active { transform: scale(0.94); }

        /* ring */
        .sb-ring {
          width: 64px; height: 64px; border-radius: 50%;
          padding: 2.5px;
          background: conic-gradient(#DD0000, #FF2E2E, #DD0000 360deg);
          transition: box-shadow 0.2s ease;
        }
        .sb-ring:hover {
          box-shadow: 0 0 0 3px rgba(221,0,0,0.25);
        }
        .sb-ring.seen {
          background: rgba(128,128,128,0.35);
        }

        .sb-inner {
          width: 100%; height: 100%; border-radius: 50%;
          overflow: hidden;
          background: var(--sb-bg);
          border: 2px solid transparent;
          position: relative;
        }
        /* the white border gap between ring and image */
        .sb-ring .sb-inner {
          border: 2.5px solid var(--sb-bg, #111);
        }

        .sb-thumb {
          width: 100%; height: 100%; object-fit: cover;
          border-radius: 50%;
        }

        /* no-image fallback */
        .sb-thumb-fallback {
          width: 100%; height: 100%; border-radius: 50%;
          background: linear-gradient(135deg, #DD0000 0%, #220000 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 700; color: #fff;
        }

        .sb-label {
          font-family: 'Barlow', sans-serif;
          font-size: 11px; font-weight: 600;
          color: var(--sb-name);
          text-align: center;
          max-width: 68px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .sb-time {
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 400;
          color: var(--sb-muted);
          margin-top: -3px;
        }

        /* skeleton shimmer */
        .sb-skel {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .sb-skel-ring {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%);
          background-size: 400% 100%;
          animation: sb-shimmer 1.4s ease infinite;
        }
        .sb-skel-label {
          width: 48px; height: 9px; border-radius: 4px;
          background: rgba(255,255,255,0.08);
          animation: sb-shimmer 1.4s ease infinite;
        }
        @keyframes sb-shimmer {
          0%   { background-position: 100% 0 }
          100% { background-position: -100% 0 }
        }
      `}</style>

      <div className="sb-root" ref={scrollRef}>
        <div className="sb-track">

          {/* Skeletons while loading */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sb-skel">
              <div className="sb-skel-ring" />
              <div className="sb-skel-label" />
            </div>
          ))}

          {/* Story items */}
          {!loading && stories.map((story, i) => (
            <div
              key={story._id}
              className="sb-item"
              onClick={() => setViewerIdx(i)}
              role="button"
              aria-label={`View story by ${story.author?.name || "Admin"}`}
            >
              <div className={`sb-ring${story.seen ? " seen" : ""}`}>
                <div className="sb-inner">
                  {story.mediaUrl ? (
                    <img
                      className="sb-thumb"
                      src={story.mediaUrl}
                      alt={story.caption || "Story"}
                    />
                  ) : (
                    <div className="sb-thumb-fallback">
                      {(story.author?.name || "G").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <span className="sb-label">{story.caption || "Breaking News"}</span>
              <span className="sb-time">{timeAgo(story.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen viewer */}
      {viewerIdx !== null && (
        <StoryViewer
          stories={stories}
          startIndex={viewerIdx}
          onClose={() => setViewerIdx(null)}
        />
      )}
    </>
  );
}