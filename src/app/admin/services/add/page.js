"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/services/serviceService";

export default function AddService() {
  const router = useRouter();
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    profile: "",
    description: "",
    mobile: "",
    whatsapp: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setFieldErrors((p) => ({ ...p, [key]: "" }));
  };

  const handleImage = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFieldErrors((p) => ({ ...p, image: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Name is required";
    if (!form.profile.trim())     e.profile     = "Profile / role is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.mobile.match(/^[0-9]{10}$/)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.whatsapp.trim())    e.whatsapp    = "WhatsApp number is required";
    if (!imageFile)               e.image       = "Profile image is required";
    return e;
  };

  const handleSubmit = async () => {
    setError("");
    const e = validate();
    if (Object.keys(e).length) { setFieldErrors(e); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name",        form.name.trim());
      fd.append("profile",     form.profile.trim());
      fd.append("description", form.description.trim());
      fd.append("mobile",      form.mobile.trim());
      fd.append("whatsapp",    form.whatsapp.trim());
      fd.append("isActive",    form.isActive);
      fd.append("file",       imageFile);   // match your multer field name

      await createService(fd);
      router.push("/admin/services");
    } catch (err) {
      setError(err.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .as-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0a0a0d;
          padding: 0 0 80px;
        }

        /* ── Sticky top bar ── */
        .as-topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(10,10,13,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .as-back {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          color: #9ca3af;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .as-back:hover { background: rgba(255,255,255,0.11); color: #fff; }

        .as-topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #f1f1f3;
          letter-spacing: -0.03em;
          flex: 1;
        }
        .as-topbar-title span { color: #8b5cf6; }

        .as-save-top {
          height: 36px;
          padding: 0 16px;
          border-radius: 10px;
          background: #8b5cf6;
          border: none;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
          box-shadow: 0 0 16px rgba(139,92,246,0.3);
          white-space: nowrap;
        }
        .as-save-top:hover:not(:disabled) { background: #7c3aed; box-shadow: 0 0 22px rgba(139,92,246,0.5); }
        .as-save-top:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Body ── */
        .as-body {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 600px;
          margin: 0 auto;
          animation: asFadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes asFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Image upload ── */
        .as-img-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 28px 20px;
          background: #111115;
          border: 1.5px dashed rgba(139,92,246,0.35);
          border-radius: 20px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .as-img-section:hover { border-color: rgba(139,92,246,0.65); background: rgba(139,92,246,0.04); }
        .as-img-section.has-img { border-style: solid; border-color: rgba(139,92,246,0.4); padding: 0; }

        .as-preview {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 18px;
          display: block;
        }
        .as-preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: 18px;
        }
        .as-img-section:hover .as-preview-overlay { opacity: 1; }
        .as-preview-change {
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          cursor: pointer;
        }

        .as-img-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #8b5cf6;
        }
        .as-img-label { font-size: 14px; font-weight: 500; color: #e5e7eb; }
        .as-img-sub { font-size: 11px; color: #6b7280; letter-spacing: 0.07em; text-transform: uppercase; }

        /* ── Section card ── */
        .as-card {
          background: #111115;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
        }
        .as-card-header {
          padding: 14px 18px 0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8b5cf6;
        }
        .as-card-body {
          padding: 12px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── Field ── */
        .as-field { display: flex; flex-direction: column; gap: 6px; }
        .as-label {
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.04em;
        }
        .as-input, .as-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 14px;
          color: #f1f1f3;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        .as-input::placeholder, .as-textarea::placeholder { color: #374151; }
        .as-input:focus, .as-textarea:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.04);
        }
        .as-input.err, .as-textarea.err { border-color: rgba(239,68,68,0.5); }
        .as-textarea { resize: none; line-height: 1.65; min-height: 100px; }

        .as-err-msg {
          font-size: 11.5px;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Input with prefix icon ── */
        .as-input-wrap { position: relative; }
        .as-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #4b5563;
          pointer-events: none;
        }
        .as-input-with-icon { padding-left: 38px !important; }

        /* ── Two columns ── */
        .as-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* ── Toggle ── */
        .as-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
        }
        .as-toggle-info { }
        .as-toggle-label { font-size: 14px; font-weight: 500; color: #e5e7eb; }
        .as-toggle-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }

        .as-toggle {
          width: 48px; height: 26px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.25s;
          flex-shrink: 0;
        }
        .as-toggle.on  { background: #8b5cf6; box-shadow: 0 0 12px rgba(139,92,246,0.4); }
        .as-toggle.off { background: rgba(255,255,255,0.1); }
        .as-toggle-thumb {
          position: absolute;
          top: 3px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #fff;
          transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .as-toggle.on  .as-toggle-thumb { left: 25px; }
        .as-toggle.off .as-toggle-thumb { left: 3px; }

        /* ── Global error ── */
        .as-global-err {
          padding: 12px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          color: #f87171;
          font-size: 13.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── Submit button ── */
        .as-submit {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          background: #8b5cf6;
          border: none;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 28px rgba(139,92,246,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }
        .as-submit:hover:not(:disabled) { background: #7c3aed; transform: translateY(-1px); box-shadow: 0 6px 30px rgba(139,92,246,0.5); }
        .as-submit:active:not(:disabled) { transform: none; }
        .as-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .as-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (min-width: 640px) {
          .as-body { padding: 28px 24px; }
          .as-topbar { padding: 14px 24px; }
          .as-preview { height: 240px; }
        }
      `}</style>

      <div className="as-root">

        {/* Sticky Top Bar */}
        <div className="as-topbar">
          <button className="as-back" onClick={() => router.back()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="as-topbar-title">Add <span>Service</span></span>
          <button className="as-save-top" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Body */}
        <div className="as-body">

          {/* ── Profile Image ── */}
          <label className={`as-img-section${imagePreview ? " has-img" : ""}`}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
            />
            {imagePreview ? (
              <>
                <img className="as-preview" src={imagePreview} alt="preview" />
                <div className="as-preview-overlay">
                  <span className="as-preview-change">Change Photo</span>
                </div>
              </>
            ) : (
              <>
                <div className="as-img-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <span className="as-img-label">Upload Profile Photo</span>
                <span className="as-img-sub">JPG · PNG · WEBP · Recommended 400×400</span>
              </>
            )}
          </label>
          {fieldErrors.image && (
            <span className="as-err-msg">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {fieldErrors.image}
            </span>
          )}

          {/* ── Basic Info ── */}
          <div className="as-card">
            <div className="as-card-header">Basic Info</div>
            <div className="as-card-body">
              <div className="as-field">
                <label className="as-label">Full Name</label>
                <div className="as-input-wrap">
                  <span className="as-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    className={`as-input as-input-with-icon${fieldErrors.name ? " err" : ""}`}
                    placeholder="e.g. Julian Thorne"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>
                {fieldErrors.name && <span className="as-err-msg">⚠ {fieldErrors.name}</span>}
              </div>

              <div className="as-field">
                <label className="as-label">Profile / Role</label>
                <div className="as-input-wrap">
                  <span className="as-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </span>
                  <input
                    className={`as-input as-input-with-icon${fieldErrors.profile ? " err" : ""}`}
                    placeholder="e.g. Fullstack Developer"
                    value={form.profile}
                    onChange={(e) => set("profile", e.target.value)}
                  />
                </div>
                {fieldErrors.profile && <span className="as-err-msg">⚠ {fieldErrors.profile}</span>}
              </div>

              <div className="as-field">
                <label className="as-label">Description</label>
                <textarea
                  className={`as-textarea${fieldErrors.description ? " err" : ""}`}
                  placeholder="Describe what this person does, their speciality and experience…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                />
                {fieldErrors.description && <span className="as-err-msg">⚠ {fieldErrors.description}</span>}
              </div>
            </div>
          </div>

          {/* ── Contact Info ── */}
          <div className="as-card">
            <div className="as-card-header">Contact Info</div>
            <div className="as-card-body">
              <div className="as-row">
                <div className="as-field">
                  <label className="as-label">Mobile</label>
                  <div className="as-input-wrap">
                    <span className="as-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                    <input
                      className={`as-input as-input-with-icon${fieldErrors.mobile ? " err" : ""}`}
                      placeholder="10-digit number"
                      type="tel"
                      maxLength={10}
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  {fieldErrors.mobile && <span className="as-err-msg" style={{fontSize:10.5}}>⚠ {fieldErrors.mobile}</span>}
                </div>

                <div className="as-field">
                  <label className="as-label">WhatsApp</label>
                  <div className="as-input-wrap">
                    <span className="as-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </span>
                    <input
                      className={`as-input as-input-with-icon${fieldErrors.whatsapp ? " err" : ""}`}
                      placeholder="with country code"
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  {fieldErrors.whatsapp && <span className="as-err-msg" style={{fontSize:10.5}}>⚠ {fieldErrors.whatsapp}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* ── Visibility ── */}
          <div className="as-card">
            <div className="as-toggle-row">
              <div className="as-toggle-info">
                <div className="as-toggle-label">Publish immediately</div>
                <div className="as-toggle-sub">Make this service visible to users right away</div>
              </div>
              <button
                className={`as-toggle ${form.isActive ? "on" : "off"}`}
                onClick={() => set("isActive", !form.isActive)}
                type="button"
              >
                <span className="as-toggle-thumb" />
              </button>
            </div>
          </div>

          {/* Global error */}
          {error && (
            <div className="as-global-err">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button className="as-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><div className="as-spinner" /> Saving Service…</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Save Service
              </>
            )}
          </button>

        </div>
      </div>
    </>
  );
}