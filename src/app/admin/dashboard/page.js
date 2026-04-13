"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export default function AdminStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [previewStory, setPreviewStory] = useState(null);
  const [form, setForm] = useState({
    caption: "",
    link: "",
    mediaType: "image",
    expiresInHours: 24,
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_BASE}/stories`);
      const data = await res.json();
      if (data.success) setStories(data.stories);
    } catch {
      setError("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
    setForm((p) => ({
      ...p,
      mediaType: f.type.startsWith("video") ? "video" : "image",
    }));
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please select a media file");
    if (!form.caption.trim()) return setError("Caption is required");
    setSubmitting(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("caption", form.caption);
    fd.append("mediaType", form.mediaType);
    fd.append("expiresInHours", form.expiresInHours);
    if (form.link) fd.append("link", form.link);
    try {
      const res = await fetch(`${API_BASE}/stories`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
     const text = await res.text();
console.log("Raw response:", text); // ← tells you exactly what's coming back
let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error(`Server error: ${res.status} — check API_BASE URL`);
}
if (!res.ok) throw new Error(data.msg || "Upload failed");
      setStories((p) => [data.story, ...p]);
      closeModal();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}/stories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setStories((p) => p.filter((s) => s._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFile(null);
    setFilePreview(null);
    setForm({ caption: "", link: "", mediaType: "image", expiresInHours: 24 });
    setError("");
  };

  const timeLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return "Expired";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        .page { background: #0a0a0f; color: #e8e6f0; min-height: 100vh; padding: 2rem; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; }
        .header h1 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 700; color: #fff; }
        .header p { color: #7a7890; font-size: 0.9rem; margin-top: 0.2rem; }
        .add-btn {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; border: none; border-radius: 12px;
          padding: 0.7rem 1.4rem; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: opacity 0.2s; white-space: nowrap;
        }
        .add-btn:hover { opacity: 0.85; }
        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }
        .story-card {
          background: #16151f; border-radius: 16px; overflow: hidden;
          border: 1px solid #2a2840; position: relative;
          transition: transform 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .story-card:hover { transform: translateY(-3px); border-color: #7c3aed; }
        .story-thumb {
          width: 100%; aspect-ratio: 9/16; object-fit: cover;
          background: #1e1d2b;
        }
        .story-thumb-video {
          width: 100%; aspect-ratio: 9/16; object-fit: cover;
          background: #1e1d2b;
        }
        .story-badge {
          position: absolute; top: 8px; left: 8px;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          border-radius: 6px; padding: 2px 7px; font-size: 0.7rem;
          font-weight: 600; color: #c4b5fd; border: 1px solid rgba(124,58,237,0.4);
        }
        .story-info { padding: 0.7rem; }
        .story-caption { font-size: 0.82rem; color: #d4d2e8; font-weight: 500; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .story-meta { font-size: 0.72rem; color: #6b6880; display: flex; align-items: center; justify-content: space-between; }
        .story-link-tag { color: #a78bfa; font-size: 0.7rem; display: flex; align-items: center; gap: 4px; }
        .story-actions { display: flex; gap: 6px; padding: 0 0.7rem 0.7rem; }
        .btn-preview {
          flex: 1; background: #2a2840; color: #c4b5fd; border: none;
          border-radius: 8px; padding: 0.4rem; font-size: 0.78rem;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-preview:hover { background: #3a3660; }
        .btn-del {
          background: #2a1a1a; color: #f87171; border: none;
          border-radius: 8px; padding: 0.4rem 0.6rem; font-size: 0.78rem;
          cursor: pointer; transition: background 0.15s; min-width: 34px;
        }
        .btn-del:hover { background: #3d1f1f; }

        /* Modal */
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px); z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .modal {
          background: #16151f; border-radius: 20px; padding: 1.8rem;
          width: 100%; max-width: 480px; border: 1px solid #2a2840;
          max-height: 90vh; overflow-y: auto;
        }
        .modal h2 { font-family: 'Syne', sans-serif; font-size: 1.3rem; color: #fff; margin-bottom: 0.4rem; }
        .modal-sub { color: #6b6880; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .upload-zone {
          border: 2px dashed #3a3660; border-radius: 14px;
          aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center;
          cursor: pointer; overflow: hidden; margin-bottom: 1.2rem;
          transition: border-color 0.2s; background: #1e1d2b; position: relative;
        }
        .upload-zone:hover { border-color: #7c3aed; }
        .upload-zone img, .upload-zone video {
          width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0;
        }
        .upload-hint { color: #6b6880; font-size: 0.85rem; text-align: center; padding: 1rem; }
        .upload-hint span { display: block; font-size: 1.5rem; margin-bottom: 0.4rem; }
        .field { margin-bottom: 1rem; }
        .field label { display: block; font-size: 0.8rem; font-weight: 600; color: #9993b8; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .field input, .field select {
          width: 100%; background: #1e1d2b; border: 1px solid #2a2840;
          border-radius: 10px; padding: 0.65rem 0.9rem; color: #e8e6f0;
          font-size: 0.9rem; outline: none; transition: border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .field input:focus, .field select:focus { border-color: #7c3aed; }
        .field select option { background: #16151f; }
        .error-msg { background: #2d1515; border: 1px solid #6b2525; border-radius: 10px; padding: 0.6rem 0.9rem; color: #f87171; font-size: 0.85rem; margin-bottom: 1rem; }
        .modal-footer { display: flex; gap: 10px; margin-top: 1.4rem; }
        .cancel-btn {
          flex: 1; background: #1e1d2b; color: #9993b8; border: 1px solid #2a2840;
          border-radius: 10px; padding: 0.7rem; font-size: 0.9rem; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .submit-btn {
          flex: 2; background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; border: none; border-radius: 10px;
          padding: 0.7rem; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: opacity 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .submit-btn:hover:not(:disabled) { opacity: 0.85; }

        /* Preview modal - Instagram style */
        .preview-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.92);
          z-index: 200; display: flex; align-items: center; justify-content: center;
        }
        .preview-frame {
          position: relative; width: min(340px, 90vw); aspect-ratio: 9/16;
          border-radius: 20px; overflow: hidden; background: #000;
        }
        .preview-media { width: 100%; height: 100%; object-fit: cover; }
        .preview-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.7) 100%);
        }
        .preview-top { position: absolute; top: 16px; left: 16px; right: 16px; display: flex; align-items: center; justify-content: space-between; }
        .preview-progress { height: 3px; background: rgba(255,255,255,0.35); border-radius: 2px; flex: 1; margin-right: 12px; }
        .preview-close { color: #fff; background: rgba(0,0,0,0.4); border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        .preview-bottom { position: absolute; bottom: 20px; left: 16px; right: 16px; }
        .preview-caption { color: #fff; font-size: 0.95rem; font-weight: 500; margin-bottom: 12px; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
        .preview-link-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.25); border-radius: 12px;
          color: #fff; padding: 0.6rem; font-size: 0.85rem; font-weight: 600;
          text-decoration: none; cursor: pointer; width: 100%;
        }

        /* Empty state */
        .empty { text-align: center; padding: 4rem 1rem; color: #6b6880; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty h3 { font-size: 1.1rem; color: #9993b8; margin-bottom: 0.4rem; }

        .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .progress-bar { height: 3px; background: rgba(255,255,255,0.3); border-radius: 2px; }
        .progress-fill { height: 100%; background: #fff; border-radius: 2px; animation: progress 5s linear forwards; }
        @keyframes progress { from { width: 0% } to { width: 100% } }

        @media (max-width: 600px) {
          .page { padding: 1rem; }
          .header h1 { font-size: 1.4rem; }
          .stories-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
          .modal { padding: 1.2rem; border-radius: 16px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div>
            <h1>Stories</h1>
            <p>{stories.length} active {stories.length === 1 ? "story" : "stories"}</p>
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Story
          </button>
        </div>

        {loading ? (
          <div className="empty">
            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: "0 auto 1rem" }} />
            <p>Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🎬</div>
            <h3>No stories yet</h3>
            <p>Click "Add Story" to create your first one.</p>
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((s) => (
              <div className="story-card" key={s._id}>
                <div onClick={() => setPreviewStory(s)} style={{ position: "relative" }}>
                  {s.mediaType === "video" ? (
                    <video className="story-thumb-video" src={s.mediaUrl} muted playsInline />
                  ) : (
                    <img className="story-thumb" src={s.mediaUrl} alt={s.caption} />
                  )}
                  <div className="story-badge">{s.mediaType === "video" ? "▶ Video" : "🖼 Image"}</div>
                </div>
                <div className="story-info">
                  <div className="story-caption">{s.caption || "No caption"}</div>
                  <div className="story-meta">
                    <span style={{ color: "#4ade80" }}>{timeLeft(s.expiresAt)}</span>
                    {s.link && (
                      <span className="story-link-tag">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        Link
                      </span>
                    )}
                  </div>
                </div>
                <div className="story-actions">
                  <button className="btn-preview" onClick={() => setPreviewStory(s)}>Preview</button>
                  <button
                    className="btn-del"
                    onClick={() => handleDelete(s._id)}
                    disabled={deleting === s._id}
                  >
                    {deleting === s._id ? <span className="spinner" /> : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Story Modal */}
      {showModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h2>New Story</h2>
            <p className="modal-sub">Upload an image or video — it'll go live instantly.</p>

            <div className="upload-zone" onClick={() => fileRef.current?.click()}>
              {filePreview ? (
                form.mediaType === "video" ? (
                  <video src={filePreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                ) : (
                  <img src={filePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )
              ) : (
                <div className="upload-hint">
                  <span>📤</span>
                  <strong style={{ color: "#c4b5fd", display: "block", marginBottom: 4 }}>Click to upload</strong>
                  <span>Image or Video (max 50MB)</span>
                </div>
              )}
              <input
                ref={fileRef} type="file"
                accept="image/*,video/*"
                style={{ display: "none" }} onChange={handleFile}
              />
            </div>

            <div className="field">
              <label>Caption *</label>
              <input
                type="text" placeholder="Write a caption..."
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
            </div>

            <div className="field">
              <label>URL / Link (optional)</label>
              <input
                type="url" placeholder="https://example.com"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>Media Type</label>
                <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="field">
                <label>Expires In</label>
                <select value={form.expiresInHours} onChange={(e) => setForm({ ...form, expiresInHours: +e.target.value })}>
                  <option value={6}>6 Hours</option>
                  <option value={12}>12 Hours</option>
                  <option value={24}>24 Hours</option>
                  <option value={48}>48 Hours</option>
                  <option value={72}>72 Hours</option>
                </select>
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><span className="spinner" /> Uploading...</> : "Publish Story"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instagram-style Story Preview */}
      {previewStory && (
        <div className="preview-overlay" onClick={() => setPreviewStory(null)}>
          <div className="preview-frame" onClick={(e) => e.stopPropagation()}>
            {previewStory.mediaType === "video" ? (
              <video className="preview-media" src={previewStory.mediaUrl} autoPlay muted loop playsInline />
            ) : (
              <img className="preview-media" src={previewStory.mediaUrl} alt={previewStory.caption} />
            )}
            <div className="preview-gradient" />
            <div className="preview-top">
              <div className="preview-progress">
                <div className="progress-fill" key={previewStory._id} />
              </div>
              <button className="preview-close" onClick={() => setPreviewStory(null)}>✕</button>
            </div>
            <div className="preview-bottom">
              {previewStory.caption && (
                <div className="preview-caption">{previewStory.caption}</div>
              )}
              {previewStory.link && (
                <Link
                  href={previewStory.link}
                  target="_blank" rel="noreferrer"
                  className="preview-link-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Visit Link
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}