"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter }         from "next/navigation";
import dynamic                          from "next/dynamic";
import { useTheme }                     from "@/context/ThemeContext";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchPost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Post not found");
  const data = await res.json();
  return data.post || data;
}

async function submitUpdate(id, formData) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || "Update failed");
  return data;
}

export default function EditPostPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const { theme } = useTheme();

  const [post,        setPost]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const [form,        setForm]        = useState({ title: "", heading: "", subheading: "" });
  const [richContent, setRichContent] = useState("");
  const [newFile,     setNewFile]     = useState(null);
  const [preview,     setPreview]     = useState(null);
  const fileRef = useRef();

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPost(id)
      .then((p) => {
        setPost(p);
        setForm({
          title:      p.title      || "",
          heading:    p.heading    || "",
          subheading: p.subheading || "",
        });
        setRichContent(p.description || "");
      })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [id]);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setNewFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!form.title.trim()) return showToast("Title is required", "error");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title.trim());
      fd.append("heading",     form.heading.trim());
      fd.append("subheading",  form.subheading.trim());
      fd.append("description", richContent);
      if (newFile) fd.append("file", newFile);

      await submitUpdate(id, fd);
      showToast("Post updated successfully");
      setTimeout(() => router.push("/admin/posts"), 1200);
    } catch (err) {
      showToast(err.message || "Failed to update post", "error");
    } finally {
      setSaving(false);
    }
  }

  const mediaType = newFile
    ? (newFile.type.startsWith("video") ? "video" : "image")
    : post?.mediaType;
  const mediaSrc = preview || post?.mediaUrl;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Figtree:wght@300;400;500;600&display=swap');

        .ep-root {
          font-family: 'Figtree', sans-serif;
          --ap-accent: #7c3aed;
          --ap-accent-light: #a78bfa;
          --ap-transition: 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        [data-theme="dark"] .ep-root {
          --ap-bg: #0d0d0f;
          --ap-card: rgba(255,255,255,0.025);
          --ap-card-border: rgba(255,255,255,0.07);
          --ap-text: #f1f1f3;
          --ap-muted: #6b7280;
          --ap-label: #4b5563;
          --ap-input-bg: rgba(255,255,255,0.05);
          --ap-input-border: rgba(255,255,255,0.08);
          --ap-input-focus: rgba(124,58,237,0.5);
          --ap-btn-bg: rgba(255,255,255,0.05);
          --ap-btn-border: rgba(255,255,255,0.08);
        }
        [data-theme="light"] .ep-root {
          --ap-bg: #f5f5f7;
          --ap-card: rgba(255,255,255,0.9);
          --ap-card-border: rgba(0,0,0,0.07);
          --ap-text: #111118;
          --ap-muted: #6b7280;
          --ap-label: #9ca3af;
          --ap-input-bg: rgba(0,0,0,0.04);
          --ap-input-border: rgba(0,0,0,0.08);
          --ap-input-focus: rgba(124,58,237,0.35);
          --ap-btn-bg: rgba(0,0,0,0.04);
          --ap-btn-border: rgba(0,0,0,0.08);
        }

        .ep-header { margin-bottom: 24px; }
        .ep-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: 1px solid var(--ap-btn-border);
          border-radius: 8px; padding: 6px 12px;
          font-size: 13px; color: var(--ap-muted);
          cursor: pointer; font-family: inherit;
          transition: all var(--ap-transition);
          margin-bottom: 14px;
        }
        .ep-back:hover { border-color: rgba(124,58,237,0.3); color: var(--ap-accent-light); }
        .ep-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 800; color: var(--ap-text);
          letter-spacing: -0.03em;
        }
        .ep-title span { color: var(--ap-accent-light); }

        .ep-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ep-grid { grid-template-columns: 1fr; }
        }

        .ep-card {
          background: var(--ap-card);
          border: 1px solid var(--ap-card-border);
          border-radius: 16px;
          padding: 22px;
        }
        .ep-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          color: var(--ap-text);
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--ap-card-border);
          letter-spacing: -0.01em;
        }

        .ep-field { margin-bottom: 16px; }
        .ep-field label {
          display: block; font-size: 10.5px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ap-label); margin-bottom: 6px;
        }
        .ep-field input, .ep-field textarea {
          width: 100%; background: var(--ap-input-bg);
          border: 1px solid var(--ap-input-border);
          border-radius: 10px; padding: 10px 12px;
          font-size: 13.5px; font-family: inherit;
          color: var(--ap-text); outline: none;
          transition: border-color var(--ap-transition), box-shadow var(--ap-transition);
          resize: vertical;
        }
        .ep-field input::placeholder, .ep-field textarea::placeholder { color: var(--ap-label); }
        .ep-field input:focus, .ep-field textarea:focus {
          border-color: var(--ap-input-focus);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.10);
        }

        .ep-upload-zone {
          border: 2px dashed var(--ap-card-border);
          border-radius: 12px; aspect-ratio: 16/9;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; overflow: hidden; margin-bottom: 14px;
          background: var(--ap-input-bg); position: relative;
          transition: border-color var(--ap-transition);
        }
        .ep-upload-zone:hover { border-color: var(--ap-accent); }
        .ep-upload-zone img, .ep-upload-zone video {
          width: 100%; height: 100%; object-fit: cover;
          position: absolute; inset: 0;
        }
        .ep-upload-hint {
          color: var(--ap-label); font-size: 12.5px;
          text-align: center; padding: 12px;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
        }
        .ep-change-badge {
          position: absolute; top: 8px; right: 8px;
          background: rgba(0,0,0,0.65);
          border-radius: 6px; padding: 3px 8px;
          font-size: 11px; color: #fff; font-weight: 600;
          backdrop-filter: blur(4px);
        }

        .ep-info-row {
          display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .ep-badge {
          font-size: 10.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 6px;
        }
        .ep-badge-video {
          background: rgba(6,182,212,0.1); color: #06b6d4;
          border: 1px solid rgba(6,182,212,0.2);
        }
        .ep-badge-image {
          background: rgba(167,139,250,0.1); color: #a78bfa;
          border: 1px solid rgba(167,139,250,0.2);
        }

        .ep-actions {
          display: flex; gap: 10px; margin-top: 20px;
          position: sticky; bottom: 0;
          background: var(--ap-card);
          padding: 16px 0 4px;
          border-top: 1px solid var(--ap-card-border);
        }
        .ep-cancel {
          flex: 1; height: 42px;
          background: var(--ap-btn-bg);
          border: 1px solid var(--ap-btn-border);
          border-radius: 10px; color: var(--ap-text);
          font-size: 13.5px; font-weight: 500;
          font-family: inherit; cursor: pointer;
          transition: opacity var(--ap-transition);
        }
        .ep-cancel:hover { opacity: 0.75; }
        .ep-save {
          flex: 2; height: 42px;
          background: var(--ap-accent); border: none;
          border-radius: 10px; color: #fff;
          font-size: 13.5px; font-weight: 600;
          font-family: inherit; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: opacity var(--ap-transition);
          box-shadow: 0 0 20px rgba(124,58,237,0.25);
        }
        .ep-save:hover:not(:disabled) { opacity: 0.88; }
        .ep-save:disabled { opacity: 0.5; cursor: not-allowed; }

        /* skeleton */
        .ep-skel { background: var(--ap-btn-bg); border-radius: 8px; animation: shimmer 1.4s ease infinite alternate; }
        @keyframes shimmer { from { opacity: 1; } to { opacity: 0.35; } }

        /* toast */
        .ep-toast {
          position: fixed; bottom: 80px; left: 50%;
          transform: translateX(-50%); z-index: 600;
          background: #1a1a2e; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 10px 18px;
          font-size: 13px; font-weight: 500; color: #f1f1f3;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: toastIn 0.25s ease; white-space: nowrap;
        }
        .ep-toast.error { border-color: rgba(248,113,113,0.3); }
        .ep-toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .ep-toast-dot.success { background: #34d399; }
        .ep-toast-dot.error   { background: #f87171; }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ep-root">
        {/* Header */}
        <div className="ep-header">
          <button className="ep-back" onClick={() => router.push("/admin/posts")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Posts
          </button>
          <h1 className="ep-title">Edit <span>Post</span></h1>
        </div>

        {loading ? (
          <div className="ep-card">
            <div className="ep-skel" style={{ height: 240, marginBottom: 16, borderRadius: 12 }} />
            <div className="ep-skel" style={{ height: 14, width: "60%", marginBottom: 10 }} />
            <div className="ep-skel" style={{ height: 14, width: "40%", marginBottom: 20 }} />
            <div className="ep-skel" style={{ height: 200, borderRadius: 12 }} />
          </div>
        ) : (
          <div className="ep-grid">
            {/* Left: content editor */}
            <div>
              <div className="ep-card">
                <div className="ep-card-title">Article Content</div>

                <div className="ep-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="News headline or post title…"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="ep-field">
                  <label>Sub-headline <span style={{ textTransform: "none", fontSize: 10, color: "var(--ap-muted)" }}>(optional, plain text)</span></label>
                  <input
                    type="text"
                    placeholder="Short one-line summary…"
                    value={form.heading}
                    onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  />
                </div>

                <div className="ep-field">
                  <label>Stand-first <span style={{ textTransform: "none", fontSize: 10, color: "var(--ap-muted)" }}>(optional italic intro line)</span></label>
                  <input
                    type="text"
                    placeholder="Introductory italic sentence…"
                    value={form.subheading}
                    onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                  />
                </div>

                <div className="ep-field">
                  <label>Article Body</label>
                  <RichEditor
                    content={richContent}
                    onChange={setRichContent}
                    placeholder="Write your full article here…"
                  />
                </div>

                <div className="ep-actions">
                  <button className="ep-cancel" onClick={() => router.push("/admin/posts")}>
                    Cancel
                  </button>
                  <button className="ep-save" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.7s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                    )}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: media + stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="ep-card">
                <div className="ep-card-title">Media</div>

                {/* Info badges */}
                {post && (
                  <div className="ep-info-row">
                    <span className={`ep-badge ${mediaType === "video" ? "ep-badge-video" : "ep-badge-image"}`}>
                      {mediaType}
                    </span>
                    <span className="ep-badge" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                      {post.views ?? 0} views
                    </span>
                    <span className="ep-badge" style={{ background: "rgba(244,114,182,0.1)", color: "#f472b6", border: "1px solid rgba(244,114,182,0.2)" }}>
                      {post.likes ?? 0} likes
                    </span>
                  </div>
                )}

                <div className="ep-upload-zone" onClick={() => fileRef.current?.click()}>
                  {mediaSrc ? (
                    <>
                      {mediaType === "video" ? (
                        <video src={mediaSrc} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                      ) : (
                        <img src={mediaSrc} alt="media" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                      )}
                      <div className="ep-change-badge">Click to change</div>
                    </>
                  ) : (
                    <div className="ep-upload-hint">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Upload new media</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={handleFile} />
                </div>

                {newFile && (
                  <p style={{ fontSize: 12, color: "var(--ap-muted)", marginTop: -8, marginBottom: 0 }}>
                    New: {newFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`ep-toast ${toast.type}`}>
          <span className={`ep-toast-dot ${toast.type}`} />
          {toast.msg}
        </div>
      )}
    </>
  );
}
