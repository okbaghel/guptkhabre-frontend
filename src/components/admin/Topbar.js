"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { createPost } from "@/module/posts/postService";

// ─── Post Image/Video Uploader ───────────────────────────────────────────────

function PostImageUploader({ onFileSelect, uploadState, uploadPct, uploadLabel }) {
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    onFileSelect(file);
  };

  const reset = () => {
    setPreview(null);
    setMediaType(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {!preview && (
        <label className="pm-upload-zone" style={{ display: "block", cursor: "pointer" }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "32px 20px" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#e5e7eb" }}>Click to upload image or video</span>
            <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>PNG · JPG · WEBP · MP4 · MOV</span>
          </div>
        </label>
      )}

      {preview && uploadState === "uploading" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "4px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, color: "#9ca3af" }}>{uploadLabel}</span>
            <span style={{ fontSize: 12.5, color: "#a78bfa", fontWeight: 600 }}>{uploadPct}%</span>
          </div>
          <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
            <div className="pm-progress-fill" style={{ width: `${uploadPct}%` }} />
          </div>
        </div>
      )}

      {preview && uploadState !== "uploading" && (
        <div style={{ position: "relative" }}>
          {mediaType === "video" ? (
            <video src={preview} controls style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, display: "block", background: "#000" }} />
          ) : (
            <img src={preview} alt="preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, display: "block" }} />
          )}
          {uploadState === "idle" && (
            <button onClick={reset} style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 500, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              ✕ Remove
            </button>
          )}
          {uploadState === "done" && (
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Uploaded successfully
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Post Modal ───────────────────────────────────────────────────────────────

function PostModal({ onClose }) {
  const [title, setTitle]           = useState("");
  const [file, setFile]             = useState(null);
  const [error, setError]           = useState("");
  const [uploadState, setUploadState] = useState("idle");
  const [uploadPct, setUploadPct]   = useState(0);
  const [uploadLabel, setUploadLabel] = useState("Uploading…");

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) return setError("Please enter a post title.");
    if (!file)         return setError("Please select an image or video.");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);

    setUploadState("uploading");
    setUploadPct(0);
    setUploadLabel("Uploading…");

    const stages = [
      { at: 30, text: "Uploading…" },
      { at: 65, text: "Processing…" },
      { at: 85, text: "Saving to database…" },
    ];
    let cur = 0;
    const timer = setInterval(() => {
      const speed = cur < 60 ? 1.2 : cur < 82 ? 0.5 : 0.1;
      cur = Math.min(89, cur + speed);
      setUploadPct(Math.floor(cur));
      stages.forEach((s) => { if (cur >= s.at) setUploadLabel(s.text); });
    }, 30);

    try {
      await createPost(formData);
      clearInterval(timer);
      setUploadPct(100);
      setUploadLabel("Done!");
      setUploadState("done");
      setTimeout(() => onClose(), 1400);
    } catch (err) {
      clearInterval(timer);
      setUploadState("idle");
      setUploadPct(0);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const isUploading = uploadState === "uploading";
  const isDone      = uploadState === "done";

  return (
    <>
      <style>{`
        @keyframes pmSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pmShimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        .pm-modal { animation: pmSlideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        .pm-upload-zone { border: 1.5px dashed rgba(124,58,237,0.4); border-radius: 14px; background: rgba(124,58,237,0.04); overflow: hidden; transition: border-color 0.2s, background 0.2s; }
        .pm-upload-zone:hover { border-color: rgba(124,58,237,0.7); background: rgba(124,58,237,0.08); }
        .pm-progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed); background-size: 200% 100%; animation: pmShimmer 1.4s linear infinite; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
        .pm-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; color: #f1f1f3; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, background 0.2s; }
        .pm-input::placeholder { color: #4b5563; }
        .pm-input:focus { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.05); }
        .pm-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .pm-field-label { font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 8px; }
        .pm-btn-cancel { height: 38px; padding: 0 18px; border-radius: 10px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #9ca3af; font-size: 13.5px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
        .pm-btn-cancel:hover:not(:disabled) { background: rgba(255,255,255,0.06); color: #e5e7eb; }
        .pm-btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }
        .pm-btn-upload { height: 38px; padding: 0 20px; border-radius: 10px; background: #7c3aed; border: none; color: #fff; font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 7px; box-shadow: 0 0 20px rgba(124,58,237,0.35); transition: all 0.2s; }
        .pm-btn-upload:hover:not(:disabled) { background: #6d28d9; transform: translateY(-1px); }
        .pm-btn-upload:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      <div
        onClick={!isUploading ? onClose : undefined}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      >
        <div
          className="pm-modal"
          onClick={(e) => e.stopPropagation()}
          style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, width: "100%", maxWidth: 520, overflow: "hidden" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 0" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#f1f1f3", letterSpacing: "-0.03em" }}>
              Create News Post
            </span>
            <button
              onClick={onClose}
              disabled={isUploading}
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", cursor: isUploading ? "not-allowed" : "pointer", fontSize: 14 }}
            >✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "18px 22px 22px" }}>
            <div>
              <div className="pm-field-label">Image or Video</div>
              <PostImageUploader onFileSelect={setFile} uploadState={uploadState} uploadPct={uploadPct} uploadLabel={uploadLabel} />
            </div>
            <div>
              <div className="pm-field-label">Post Title</div>
              <input
                className="pm-input"
                type="text"
                placeholder="Enter a compelling headline…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading || isDone}
              />
            </div>
            {error && (
              <div style={{ padding: "9px 13px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 13 }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button className="pm-btn-cancel" onClick={onClose} disabled={isUploading}>Cancel</button>
            <button className="pm-btn-upload" onClick={handleSubmit} disabled={isUploading || isDone}>
              {isUploading ? (
                `${uploadLabel} ${uploadPct}%`
              ) : isDone ? (
                "✓ Posted!"
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                  Upload Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export default function Topbar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Listen for events dispatched by the mobile bottom bar
  useEffect(() => {
    const openModal   = () => setShowModal(true);
    const openLogout  = () => setShowLogoutConfirm(true);
    window.addEventListener("open-add-post-modal", openModal);
    window.addEventListener("open-logout-confirm", openLogout);
    return () => {
      window.removeEventListener("open-add-post-modal", openModal);
      window.removeEventListener("open-logout-confirm", openLogout);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        .topbar-root { font-family: 'DM Sans', sans-serif; }
        .topbar-root[data-theme="dark"] {
          --tb-bg: rgba(13,13,15,0.88); --tb-border: rgba(255,255,255,0.07);
          --tb-text: #f1f1f3; --tb-muted: #6b7280; --tb-icon: #9ca3af;
          --tb-divider: rgba(255,255,255,0.07); --tb-toggle-bg: rgba(255,255,255,0.06);
          --tb-toggle-border: rgba(255,255,255,0.09); --tb-toggle-hover: rgba(255,255,255,0.1);
          --tb-add-bg: #7c3aed; --tb-add-shadow: rgba(124,58,237,0.35);
          --tb-logout-bg: rgba(239,68,68,0.1); --tb-logout-border: rgba(239,68,68,0.22);
          --tb-logout-text: #f87171; --tb-logout-hover: rgba(239,68,68,0.2);
          --tb-confirm-bg: #111114; --tb-confirm-border: rgba(255,255,255,0.1);
          --tb-brand-sub: #6b7280; --tb-teal: #06b6d4;
        }
        .topbar-root[data-theme="light"] {
          --tb-bg: rgba(255,255,255,0.92); --tb-border: rgba(0,0,0,0.08);
          --tb-text: #111118; --tb-muted: #9ca3af; --tb-icon: #6b7280;
          --tb-divider: rgba(0,0,0,0.07); --tb-toggle-bg: rgba(0,0,0,0.05);
          --tb-toggle-border: rgba(0,0,0,0.09); --tb-toggle-hover: rgba(0,0,0,0.09);
          --tb-add-bg: #7c3aed; --tb-add-shadow: rgba(124,58,237,0.2);
          --tb-logout-bg: rgba(239,68,68,0.06); --tb-logout-border: rgba(239,68,68,0.16);
          --tb-logout-text: #dc2626; --tb-logout-hover: rgba(239,68,68,0.12);
          --tb-confirm-bg: #fff; --tb-confirm-border: rgba(0,0,0,0.1);
          --tb-brand-sub: #9ca3af; --tb-teal: #0891b2;
        }
        .tb-bar {
          position: sticky; top: 0; z-index: 40; height: 62px;
          background: var(--tb-bg); backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid var(--tb-border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px; gap: 12px; transition: background 0.3s ease, border-color 0.3s ease;
        }
        .tb-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; flex-shrink: 0; }
        .tb-logo-wrap { width: 36px; height: 36px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(124,58,237,0.35); font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: #fff; }
        .tb-brand-text { display: flex; flex-direction: column; line-height: 1; }
        .tb-brand-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: var(--tb-text); letter-spacing: -0.03em; }
        .tb-brand-name span { color: var(--tb-teal); }
        .tb-brand-sub { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--tb-brand-sub); margin-top: 2px; }
        .tb-sep { width: 1px; height: 28px; background: var(--tb-divider); flex-shrink: 0; }
        .tb-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .tb-toggle { width: 36px; height: 36px; background: var(--tb-toggle-bg); border: 1px solid var(--tb-toggle-border); border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--tb-icon); transition: all 0.2s ease; }
        .tb-toggle:hover { background: var(--tb-toggle-hover); color: var(--tb-text); }

        /* Add Post button — hidden on mobile (bottom bar handles it) */
        .tb-add-btn { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; background: var(--tb-add-bg); border: none; border-radius: 10px; color: #fff; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: opacity 0.2s, transform 0.2s; box-shadow: 0 0 18px var(--tb-add-shadow); white-space: nowrap; }
        .tb-add-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .tb-add-btn .lbl { display: none; }

        /* Logout button — hidden on mobile (bottom bar handles it) */
        .tb-logout-btn { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 13px; background: var(--tb-logout-bg); border: 1px solid var(--tb-logout-border); border-radius: 10px; color: var(--tb-logout-text); font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
        .tb-logout-btn:hover { background: var(--tb-logout-hover); }
        .tb-logout-btn .lbl { display: none; }

        @media (max-width: 768px) {
          .tb-add-btn { display: none !important; }
          .tb-logout-btn { display: none !important; }
          .tb-sep { display: none; }
        }

        .tb-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; animation: tbFadeIn 0.15s ease; }
        @keyframes tbFadeIn { from { opacity:0 } to { opacity:1 } }
        .tb-confirm-card { background: var(--tb-confirm-bg); border: 1px solid var(--tb-confirm-border); border-radius: 18px; padding: 24px; width: 100%; max-width: 320px; animation: tbSlideUp 0.2s cubic-bezier(0.4,0,0.2,1); }
        @keyframes tbSlideUp { from { transform: translateY(14px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        .tb-confirm-icon { width: 46px; height: 46px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f87171; margin-bottom: 14px; }
        .tb-confirm-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--tb-text); margin-bottom: 6px; }
        .tb-confirm-sub { font-size: 13px; color: var(--tb-muted); line-height: 1.55; margin-bottom: 20px; }
        .tb-confirm-actions { display: flex; gap: 8px; }
        .tb-confirm-cancel { flex: 1; height: 40px; background: var(--tb-toggle-bg); border: 1px solid var(--tb-toggle-border); border-radius: 10px; color: var(--tb-text); font-size: 13.5px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: opacity 0.15s; }
        .tb-confirm-cancel:hover { opacity: 0.75; }
        .tb-confirm-signout { flex: 1; height: 40px; background: #dc2626; border: none; border-radius: 10px; color: #fff; font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.15s; }
        .tb-confirm-signout:hover { background: #b91c1c; }

        @media (min-width: 400px) { .tb-add-btn .lbl { display: inline; } .tb-logout-btn .lbl { display: inline; } }
        @media (min-width: 640px) { .tb-bar { padding: 0 24px; gap: 16px; } .tb-actions { gap: 10px; } }
      `}</style>

      <div className="topbar-root" data-theme={theme}>
        <header className="tb-bar">

          <div className="tb-brand" onClick={() => router.push("/admin/dashboard")}>
            <div className="tb-logo-wrap">
              <Image src="/logo.png" alt="GuptKhabre" width={36} height={36} style={{ objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div className="tb-brand-text">
              <span className="tb-brand-name">Gupt<span>Khabre</span></span>
              <span className="tb-brand-sub">Admin Console</span>
            </div>
          </div>

          <div className="tb-sep" />

          <div className="tb-actions">
            {/* Theme toggle — always visible */}
            <button className="tb-toggle" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Add Post — desktop only, hidden on mobile via CSS */}
            <button className="tb-add-btn" onClick={() => setShowModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="lbl">Add Post</span>
            </button>

            {/* Logout — desktop only, hidden on mobile via CSS */}
            <button className="tb-logout-btn" onClick={() => setShowLogoutConfirm(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="lbl">Logout</span>
            </button>
          </div>
        </header>

        {/* Logout confirm — shared by both desktop topbar and mobile bottom bar */}
        {showLogoutConfirm && (
          <div className="tb-confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
            <div className="tb-confirm-card" onClick={(e) => e.stopPropagation()}>
              <div className="tb-confirm-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <div className="tb-confirm-title">Sign out?</div>
              <div className="tb-confirm-sub">You'll be signed out and redirected to the login page.</div>
              <div className="tb-confirm-actions">
                <button className="tb-confirm-cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                <button className="tb-confirm-signout" onClick={() => { setShowLogoutConfirm(false); logout(); }}>Sign out</button>
              </div>
            </div>
          </div>
        )}

        {/* Create post modal */}
        {showModal && <PostModal onClose={() => setShowModal(false)} />}
      </div>
    </>
  );
}