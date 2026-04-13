"use client";

import { getServices, deleteService, updateService } from "@/services/serviceService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServiceCard from "@/components/admin/ServiceCard";

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all"); // all | active | inactive

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch {
      alert("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  const handleDelete = async (service) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(service._id);
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (service) => router.push(`/admin/services/${service._id}/edit`);

  const handleToggle = async (service) => {
    try {
      await updateService(service._id, { isActive: !service.isActive });
      setServices((prev) =>
        prev.map((s) => s._id === service._id ? { ...s, isActive: !s.isActive } : s)
      );
    } catch (err) { alert(err.message); }
  };

  // Filter + search
  const visible = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.profile?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "active" ? s.isActive : !s.isActive;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0a0a0d;
          padding: 20px 16px 60px;
        }

        /* Header */
        .sp-header {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .sp-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .sp-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #f1f1f3;
          letter-spacing: -0.03em;
        }
        .sp-title span { color: #8b5cf6; }
        .sp-count {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }

        .sp-add-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          height: 40px;
          padding: 0 18px;
          background: #8b5cf6;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 20px rgba(139,92,246,0.35);
          white-space: nowrap;
        }
        .sp-add-btn:hover { background: #7c3aed; transform: translateY(-1px); box-shadow: 0 4px 24px rgba(139,92,246,0.5); }

        /* Search + filter bar */
        .sp-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sp-search-wrap {
          position: relative;
          width: 100%;
        }
        .sp-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }
        .sp-search {
          width: 100%;
          height: 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0 14px 0 38px;
          color: #f1f1f3;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .sp-search::placeholder { color: #4b5563; }
        .sp-search:focus { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.04); }

        .sp-filters {
          display: flex;
          gap: 6px;
        }
        .sp-filter-btn {
          flex: 1;
          height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #9ca3af;
          font-size: 12.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sp-filter-btn:hover { background: rgba(255,255,255,0.08); color: #e5e7eb; }
        .sp-filter-btn.active {
          background: rgba(139,92,246,0.2);
          border-color: rgba(139,92,246,0.4);
          color: #a78bfa;
        }

        /* Stats row */
        .sp-stats {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .sp-stat {
          flex: 1;
          background: #111115;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 12px 14px;
        }
        .sp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f1f1f3;
          line-height: 1;
        }
        .sp-stat-val.purple { color: #8b5cf6; }
        .sp-stat-val.green  { color: #10b981; }
        .sp-stat-val.gray   { color: #9ca3af; }
        .sp-stat-label {
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        /* Grid */
        .sp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        /* Empty / loading */
        .sp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #6b7280;
          font-size: 14px;
          gap: 10px;
          text-align: center;
        }
        .sp-empty-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          color: #4b5563;
        }

        .sp-skeleton {
          background: linear-gradient(90deg, #1a1a1f 25%, #222228 50%, #1a1a1f 75%);
          background-size: 200% 100%;
          animation: skShimmer 1.4s infinite;
          border-radius: 20px;
          height: 180px;
        }
        @keyframes skShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @media (min-width: 640px) {
          .sp-root { padding: 28px 24px 60px; }
          .sp-controls { flex-direction: row; }
          .sp-search-wrap { flex: 1; }
          .sp-filters { flex: none; }
          .sp-filter-btn { flex: none; padding: 0 16px; }
          .sp-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .sp-root { padding: 36px 32px 60px; }
          .sp-grid { grid-template-columns: repeat(3, 1fr); }
          .sp-title { font-size: 28px; }
        }
      `}</style>

      <div className="sp-root">

        {/* Header */}
        <div className="sp-header">
          <div className="sp-header-top">
            <div>
              <div className="sp-title">All <span>Services</span></div>
              <div className="sp-count">{visible.length} of {services.length} services</div>
            </div>
            <button className="sp-add-btn" onClick={() => router.push("/admin/services/add")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Service
            </button>
          </div>

          {/* Search + Filters */}
          <div className="sp-controls">
            <div className="sp-search-wrap">
              <span className="sp-search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                className="sp-search"
                type="text"
                placeholder="Search by name or profile…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="sp-filters">
              {["all", "active", "inactive"].map((f) => (
                <button
                  key={f}
                  className={`sp-filter-btn${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="sp-stats">
          <div className="sp-stat">
            <div className="sp-stat-val purple">{services.length}</div>
            <div className="sp-stat-label">Total</div>
          </div>
          <div className="sp-stat">
            <div className="sp-stat-val green">{services.filter(s => s.isActive).length}</div>
            <div className="sp-stat-label">Active</div>
          </div>
          <div className="sp-stat">
            <div className="sp-stat-val gray">{services.filter(s => !s.isActive).length}</div>
            <div className="sp-stat-label">Inactive</div>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="sp-grid">
            {[1,2,3,4,5,6].map((n) => <div key={n} className="sp-skeleton" />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && visible.length === 0 && (
          <div className="sp-empty">
            <div className="sp-empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            {search || filter !== "all" ? "No services match your search." : "No services found. Add your first one!"}
          </div>
        )}

        {/* Grid */}
        {!loading && visible.length > 0 && (
          <div className="sp-grid">
            {visible.map((service, i) => (
              <div key={service._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <ServiceCard
                  service={service}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}