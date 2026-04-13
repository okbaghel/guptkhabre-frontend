"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL 

export default function StoriesViewer() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null); // null = closed
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);
  const DURATION = 5000; // ms per story
  const TICK = 50;

  useEffect(() => {
    fetch(`${API_BASE}/stories`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setStories(d.stories); })
      .finally(() => setLoading(false));
  }, []);

  const clearTick = () => clearInterval(intervalRef.current);

  const startTick = useCallback(() => {
    clearTick();
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return p;
        return p + (TICK / DURATION) * 100;
      });
    }, TICK);
  }, [paused]);

  useEffect(() => {
    if (activeIdx === null) return;
    setProgress(0);
    startTick();
    return clearTick;
  }, [activeIdx]);

  useEffect(() => {
    if (progress >= 100) {
      clearTick();
      setTimeout(() => goNext(), 150);
    }
  }, [progress]);

  useEffect(() => {
    if (paused) clearTick();
    else startTick();
  }, [paused, startTick]);

  const openStory = (idx) => {
    setActiveIdx(idx);
    setProgress(0);
    setPaused(false);
  };

  const closeStory = () => {
    setActiveIdx(null);
    clearTick();
  };

  const goNext = () => {
    if (activeIdx < stories.length - 1) {
      setActiveIdx((p) => p + 1);
      setProgress(0);
    } else closeStory();
  };

  const goPrev = () => {
    if (activeIdx > 0) {
      setActiveIdx((p) => p - 1);
      setProgress(0);
    }
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (activeIdx === null) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeStory();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIdx]);

  const currentStory = activeIdx !== null ? stories[activeIdx] : null;

  if (loading) {
    return (
      <div style={{ display: "flex", gap: 12, padding: "1rem" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#2a2840", animation: "pulse 1.4s ease infinite",
            animationDelay: `${i * 0.15}s`, flexShrink: 0,
          }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .stories-scroll {
          display: flex; gap: 14px; padding: 1rem 1rem;
          overflow-x: auto; scrollbar-width: none;
        }
        .stories-scroll::-webkit-scrollbar { display: none; }
        .story-bubble {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; flex-shrink: 0; cursor: pointer;
        }
        .story-ring {
          width: 68px; height: 68px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b);
          padding: 3px; transition: transform 0.2s;
        }
        .story-ring:hover { transform: scale(1.06); }
        .story-ring-seen {
          background: #3a3660;
        }
        .story-inner {
          width: 100%; height: 100%; border-radius: 50%;
          border: 2.5px solid #0a0a0f; overflow: hidden;
          background: #1e1d2b;
        }
        .story-inner img { width: 100%; height: 100%; object-fit: cover; }
        .story-inner video { width: 100%; height: 100%; object-fit: cover; }
        .story-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; color: #9993b8; text-align: center;
          max-width: 68px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* Full-screen viewer */
        .sv-overlay {
          position: fixed; inset: 0; background: #000;
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .sv-frame {
          position: relative; width: min(390px, 100vw);
          height: min(844px, 100vh); overflow: hidden; background: #111;
        }
        .sv-media {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .sv-gradient {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to bottom,
            rgba(0,0,0,0.55) 0%, transparent 25%,
            transparent 55%, rgba(0,0,0,0.8) 100%);
        }

        /* Progress bars */
        .sv-bars {
          position: absolute; top: 12px; left: 12px; right: 12px;
          display: flex; gap: 4px; z-index: 10;
        }
        .sv-bar-track {
          flex: 1; height: 2.5px; background: rgba(255,255,255,0.28); border-radius: 2px; overflow: hidden;
        }
        .sv-bar-fill {
          height: 100%; background: #fff; border-radius: 2px;
          transition: width 0.05s linear;
        }

        /* Header */
        .sv-header {
          position: absolute; top: 28px; left: 16px; right: 16px;
          display: flex; align-items: center; justify-content: space-between; z-index: 10;
        }
        .sv-avatar {
          width: 34px; height: 34px; border-radius: 50%; overflow: hidden;
          border: 2px solid rgba(255,255,255,0.5); background: #2a2840;
        }
        .sv-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .sv-name { color: #fff; font-size: 0.9rem; font-weight: 600; margin-left: 8px; flex: 1; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
        .sv-close {
          background: rgba(0,0,0,0.35); border: none; color: #fff;
          width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; transition: background 0.15s;
        }
        .sv-close:hover { background: rgba(0,0,0,0.6); }

        /* Tap zones */
        .sv-tap-prev {
          position: absolute; left: 0; top: 0; width: 35%; height: 100%;
          z-index: 5; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .sv-tap-next {
          position: absolute; right: 0; top: 0; width: 35%; height: 100%;
          z-index: 5; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .sv-tap-hold {
          position: absolute; left: 35%; top: 0; width: 30%; height: 100%;
          z-index: 5; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }

        /* Bottom */
        .sv-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 1.2rem;
          z-index: 10;
        }
        .sv-caption {
          color: #fff; font-size: 0.95rem; font-weight: 500; margin-bottom: 14px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.6); line-height: 1.4;
        }
        .sv-link-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(255,255,255,0.13); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.22); border-radius: 14px;
          color: #fff; padding: 0.75rem 1rem; font-size: 0.9rem; font-weight: 600;
          text-decoration: none; cursor: pointer; width: 100%; font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .sv-link-btn:hover { background: rgba(255,255,255,0.22); }
        .sv-link-arrow {
          margin-left: auto; transition: transform 0.15s;
        }
        .sv-link-btn:hover .sv-link-arrow { transform: translateX(3px); }

        /* Side nav (desktop) */
        .sv-nav-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.12); border: none; color: #fff;
          width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; z-index: 20;
        }
        .sv-nav-btn:hover { background: rgba(255,255,255,0.25); }
        .sv-nav-prev { left: -56px; }
        .sv-nav-next { right: -56px; }

        @media (max-width: 600px) {
          .sv-nav-btn { display: none; }
        }
      `}</style>

      {/* Story bubbles */}
      <div className="stories-scroll">
        {stories.map((s, i) => (
          <div className="story-bubble" key={s._id} onClick={() => openStory(i)}>
            <div className="story-ring">
              <div className="story-inner">
                {s.mediaType === "video" ? (
                  <video src={s.mediaUrl} muted playsInline />
                ) : (
                  <img src={s.mediaUrl} alt={s.caption} />
                )}
              </div>
            </div>
            <span className="story-label">{s.caption?.slice(0, 12) || "Story"}</span>
          </div>
        ))}
      </div>

      {/* Full-screen viewer */}
      {activeIdx !== null && currentStory && (
        <div className="sv-overlay">
          <div style={{ position: "relative" }}>
            {/* Desktop prev/next */}
            {activeIdx > 0 && (
              <button className="sv-nav-btn sv-nav-prev" onClick={goPrev}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            {activeIdx < stories.length - 1 && (
              <button className="sv-nav-btn sv-nav-next" onClick={goNext}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            )}

            <div className="sv-frame">
              {/* Media */}
              {currentStory.mediaType === "video" ? (
                <video
                  ref={videoRef} key={currentStory._id}
                  className="sv-media" src={currentStory.mediaUrl}
                  autoPlay muted playsInline loop
                />
              ) : (
                <img key={currentStory._id} className="sv-media" src={currentStory.mediaUrl} alt={currentStory.caption} />
              )}

              <div className="sv-gradient" />

              {/* Progress bars */}
              <div className="sv-bars">
                {stories.map((_, i) => (
                  <div className="sv-bar-track" key={i}>
                    <div
                      className="sv-bar-fill"
                      style={{
                        width: i < activeIdx ? "100%" : i === activeIdx ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="sv-header">
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div className="sv-avatar">
                    <img src={currentStory.mediaUrl} alt="" />
                  </div>
                  <span className="sv-name">Story {activeIdx + 1} / {stories.length}</span>
                </div>
                <button className="sv-close" onClick={closeStory}>✕</button>
              </div>

              {/* Tap zones */}
              <div
                className="sv-tap-prev"
                onClick={goPrev}
                onMouseDown={() => setPaused(true)}
                onMouseUp={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
              />
              <div
                className="sv-tap-hold"
                onMouseDown={() => setPaused(true)}
                onMouseUp={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
              />
              <div
                className="sv-tap-next"
                onClick={goNext}
                onMouseDown={() => setPaused(true)}
                onMouseUp={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
              />

              {/* Bottom */}
              <div className="sv-bottom">
                {currentStory.caption && (
                  <div className="sv-caption">{currentStory.caption}</div>
                )}
                {currentStory.link && (
                  <Link
                    href={currentStory.link} target="_blank" rel="noreferrer"
                    className="sv-link-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    Visit Link
                    <span className="sv-link-arrow">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}