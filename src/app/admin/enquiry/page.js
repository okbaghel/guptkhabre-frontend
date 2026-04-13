
"use client"
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
// (`${API_BASE}/stories`);

const PURPOSE_COLORS = {
  "General Inquiry": { bg: "#1e3a5f", text: "#60a5fa" },
  "Expert Consultation": { bg: "#1a3a2a", text: "#4ade80" },
  "News Tip / Leak": { bg: "#3a1a2a", text: "#f472b6" },
  Partnership: { bg: "#2d2a1a", text: "#facc15" },
  "Media Enquiry": { bg: "#2a1a3a", text: "#a78bfa" },
  Other: { bg: "#2a2a2a", text: "#94a3b8" },
};

const STATUS_CONFIG = {
  pending: { label: "Pending", bg: "#2d1f00", text: "#f59e0b", dot: "#f59e0b" },
  resolved: { label: "Resolved", bg: "#052e16", text: "#22c55e", dot: "#22c55e" },
};

function Badge({ type, value }) {
  const config =
    type === "status"
      ? STATUS_CONFIG[value]
      : PURPOSE_COLORS[value] || PURPOSE_COLORS["Other"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: type === "status" ? "uppercase" : "none",
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.text}22`,
        whiteSpace: "nowrap",
      }}
    >
      {type === "status" && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: config.dot,
            flexShrink: 0,
          }}
        />
      )}
      {type === "status" ? config.label : value}
    </span>
  );
}

function UpdateModal({ enquiry, onClose, onUpdate }) {
  const [status, setStatus] = useState(enquiry.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
     const res = await fetch(`${API_BASE}/contact/${enquiry._id}`, {
  method: "PUT",
  credentials: "include", // ✅
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status }),
});
      const data = await res.json();
      if (data.success) onUpdate(data.enquiry);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#111318",
          border: "1px solid #2a2d35",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          padding: "28px",
          animation: "slideUp 0.2s ease",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'IBM Plex Mono', monospace" }}>
              Update Enquiry
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>
              {enquiry.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#1e2028", border: "1px solid #2a2d35", borderRadius: "8px", color: "#64748b", width: 32, height: 32, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            X
          </button>
        </div>

        <div
          style={{
            background: "#0d0f13",
            border: "1px solid #1e2028",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>Contact</p>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 10px" }}>{enquiry.contact}</p>
          {enquiry.purpose && (
            <>
              <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>Purpose</p>
              <Badge type="purpose" value={enquiry.purpose} />
            </>
          )}
          {enquiry.message && (
            <>
              <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", margin: "10px 0 6px", fontFamily: "'IBM Plex Mono', monospace" }}>Message</p>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {enquiry.message || "—"}
              </p>
            </>
          )}
        </div>

        <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>
          Status
        </p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          {["pending", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: status === s ? `1px solid ${STATUS_CONFIG[s].dot}44` : "1px solid #2a2d35",
                background: status === s ? STATUS_CONFIG[s].bg : "#0d0f13",
                color: status === s ? STATUS_CONFIG[s].text : "#475569",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.15s",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: status === s ? STATUS_CONFIG[s].dot : "#475569" }} />
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "11px", background: "#1e2028", border: "1px solid #2a2d35", borderRadius: "10px", color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1, padding: "11px", background: loading ? "#1a2a1a" : "#166534", border: "1px solid #16a34a44", borderRadius: "10px", color: loading ? "#4ade80" : "#4ade80", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 700 }}
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ enquiry, onClose, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
     const res = await fetch(`${API_BASE}/contact/${enquiry._id}`, {
  method: "DELETE",
  credentials: "include", // ✅
});
      const data = await res.json();
      if (data.success) onDelete(enquiry._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", animation: "fadeIn 0.15s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{ background: "#111318", border: "1px solid #3f1515", borderRadius: "16px", width: "100%", maxWidth: "380px", padding: "28px", animation: "slideUp 0.2s ease", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
      >
        <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#2a0f0f", border: "1px solid #7f1d1d44", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "20px" }}>
          🗑
        </div>
        <h2 style={{ color: "#f1f5f9", fontSize: "17px", fontWeight: 700, marginBottom: "8px", fontFamily: "'Sora', sans-serif" }}>Delete Enquiry?</h2>
        <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px" }}>
          This will permanently remove the enquiry from <strong style={{ color: "#94a3b8" }}>{enquiry.name}</strong>. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "#1e2028", border: "1px solid #2a2d35", borderRadius: "10px", color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{ flex: 1, padding: "11px", background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: "10px", color: "#f87171", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 700 }}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EnquiryCard({ enquiry, onEdit, onDelete }) {
  const date = new Date(enquiry.createdAt);
  const formatted = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      style={{
        background: "#0d0f13",
        border: "1px solid #1e2028",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2a2d35")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2028")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div>
          <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "15px", margin: "0 0 3px", fontFamily: "'Sora', sans-serif" }}>{enquiry.name}</p>
          <p style={{ color: "#475569", fontSize: "12px", margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>{enquiry.contact}</p>
        </div>
        <Badge type="status" value={enquiry.status} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {enquiry.purpose && <Badge type="purpose" value={enquiry.purpose} />}
        <span style={{ color: "#334155", fontSize: "11px", marginLeft: "auto", fontFamily: "'IBM Plex Mono', monospace" }}>{formatted}</span>
      </div>

      {enquiry.message && (
        <p style={{
          color: "#475569", fontSize: "12px", lineHeight: 1.65, margin: 0,
          background: "#080a0d", padding: "10px", borderRadius: "8px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          borderLeft: "2px solid #1e2028",
        }}>
          {enquiry.message}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => onEdit(enquiry)}
          style={{ flex: 1, padding: "9px", background: "#0f1f2e", border: "1px solid #1e3a5f", borderRadius: "8px", color: "#60a5fa", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
        >
          ✏ Edit Status
        </button>
        <button
          onClick={() => onDelete(enquiry)}
          style={{ padding: "9px 14px", background: "#1a0a0a", border: "1px solid #3f1515", borderRadius: "8px", color: "#f87171", cursor: "pointer", fontSize: "12px" }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default function Enquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPurpose, setFilterPurpose] = useState("all");
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
  
     const res = await fetch(`${API_BASE}/contact`, {
  credentials: "include", // ✅ VERY IMPORTANT
});
      console.log("STATUS:", res.status);
      const data = await res.json();
      console.log(data);
      if (data.success) setEnquiries(data.enquiries);
      else setError("Failed to load enquiries.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleUpdate = (updated) => {
    setEnquiries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
    setEditTarget(null);
  };

  const handleDelete = (id) => {
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    setDeleteTarget(null);
  };

  const filtered = enquiries.filter((e) => {
    if (filterStatus !== "all" && e.status !== filterStatus) return false;
    if (filterPurpose !== "all" && e.purpose !== filterPurpose) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.name?.toLowerCase().includes(q) && !e.contact?.toLowerCase().includes(q) && !e.message?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const purposes = ["General Inquiry", "Expert Consultation", "News Tip / Leak", "Partnership", "Media Enquiry", "Other"];
  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0d0f13; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        .row-hover:hover { background: #0d0f13 !important; }
        .icon-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .filter-chip:hover { border-color: #3a3d45 !important; color: #cbd5e1 !important; }
        input::placeholder { color: #334155; }
        input:focus { outline: none; border-color: #334155 !important; }
        select:focus { outline: none; }
        @media (max-width: 768px) { .desktop-table { display: none !important; } .mobile-cards { display: flex !important; } }
        @media (min-width: 769px) { .desktop-table { display: block !important; } .mobile-cards { display: none !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080a0d", color: "#f1f5f9", fontFamily: "'Sora', sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px)" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</span>
              <span style={{ color: "#1e2028" }}>·</span>
              <span style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Enquiries</span>
            </div>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              Enquiry Management
            </h1>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
            {[
              { label: "Total", value: stats.total, color: "#60a5fa", bg: "#0f1f2e" },
              { label: "Pending", value: stats.pending, color: "#f59e0b", bg: "#1a1200" },
              { label: "Resolved", value: stats.resolved, color: "#22c55e", bg: "#051a0d" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}18`, borderRadius: "12px", padding: "clamp(12px, 3vw, 18px)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: "11px", color: "#475569", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, contact…"
                style={{ width: "100%", padding: "9px 12px 9px 34px", background: "#0d0f13", border: "1px solid #1e2028", borderRadius: "10px", color: "#cbd5e1", fontSize: "13px" }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: "9px 14px", background: "#0d0f13", border: "1px solid #1e2028", borderRadius: "10px", color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={filterPurpose}
              onChange={(e) => setFilterPurpose(e.target.value)}
              style={{ padding: "9px 14px", background: "#0d0f13", border: "1px solid #1e2028", borderRadius: "10px", color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="all">All Purposes</option>
              {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {(filterStatus !== "all" || filterPurpose !== "all" || search) && (
              <button
                onClick={() => { setFilterStatus("all"); setFilterPurpose("all"); setSearch(""); }}
                style={{ padding: "9px 14px", background: "#1e2028", border: "1px solid #2a2d35", borderRadius: "10px", color: "#64748b", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
              >
                Clear ×
              </button>
            )}
          </div>

          {/* Results count */}
          {!loading && (
            <p style={{ color: "#334155", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "16px" }}>
              Showing {filtered.length} of {enquiries.length} enquiries
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: 56, background: "#0d0f13", borderRadius: "10px", animation: "pulse 1.5s ease infinite", animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ padding: "20px", background: "#2a0f0f", border: "1px solid #7f1d1d", borderRadius: "12px", color: "#f87171", textAlign: "center" }}>
              <p style={{ marginBottom: "10px" }}>{error}</p>
              <button onClick={fetchEnquiries} style={{ padding: "8px 18px", background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: "8px", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "#334155" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>No enquiries found</p>
              <p style={{ fontSize: "13px" }}>Try adjusting your filters</p>
            </div>
          )}

          {/* Desktop Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="desktop-table" style={{ background: "#0d0f13", border: "1px solid #1e2028", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2028" }}>
                      {["Name & Contact", "Purpose", "Message", "Status", "Date", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e, i) => {
                      const date = new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                      return (
                        <tr
                          key={e._id}
                          className="row-hover"
                          style={{ borderBottom: i < filtered.length - 1 ? "1px solid #13151a" : "none", background: "transparent", transition: "background 0.1s" }}
                        >
                          <td style={{ padding: "14px 16px" }}>
                            <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "14px", marginBottom: "2px" }}>{e.name}</p>
                            <p style={{ color: "#475569", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace" }}>{e.contact}</p>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {e.purpose ? <Badge type="purpose" value={e.purpose} /> : <span style={{ color: "#334155", fontSize: "12px" }}>—</span>}
                          </td>
                          <td style={{ padding: "14px 16px", maxWidth: "200px" }}>
                            <p style={{ color: "#475569", fontSize: "12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {e.message || <span style={{ color: "#334155" }}>—</span>}
                            </p>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <Badge type="status" value={e.status} />
                          </td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#334155", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace" }}>{date}</span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                className="icon-btn"
                                onClick={() => setEditTarget(e)}
                                style={{ padding: "7px 12px", background: "#0f1f2e", border: "1px solid #1e3a5f", borderRadius: "8px", color: "#60a5fa", cursor: "pointer", fontSize: "12px", fontWeight: 600, transition: "all 0.15s" }}
                              >
                                ✏ Edit
                              </button>
                              <button
                                className="icon-btn"
                                onClick={() => setDeleteTarget(e)}
                                style={{ padding: "7px 10px", background: "#1a0a0a", border: "1px solid #3f1515", borderRadius: "8px", color: "#f87171", cursor: "pointer", fontSize: "13px", transition: "all 0.15s" }}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards */}
          {!loading && !error && filtered.length > 0 && (
            <div className="mobile-cards" style={{ flexDirection: "column", gap: "10px", display: "none" }}>
              {filtered.map((e) => (
                <EnquiryCard key={e._id} enquiry={e} onEdit={setEditTarget} onDelete={setDeleteTarget} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editTarget && <UpdateModal enquiry={editTarget} onClose={() => setEditTarget(null)} onUpdate={handleUpdate} />}
      {deleteTarget && <DeleteConfirm enquiry={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={handleDelete} />}
    </>
  );
}