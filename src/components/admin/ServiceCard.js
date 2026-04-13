"use client";

export default function ServiceCard({ service, onDelete, onEdit, onToggle }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sc-card {
          font-family: 'DM Sans', sans-serif;
          background: #111115;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
          animation: scFadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sc-card:hover {
          transform: translateY(-3px);
          border-color: rgba(139,92,246,0.3);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1);
        }
        @keyframes scFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sc-top {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 18px 14px;
        }

        .sc-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .sc-avatar {
          width: 62px;
          height: 62px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid rgba(139,92,246,0.3);
          display: block;
        }
        .sc-status-dot {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid #111115;
        }
        .sc-status-dot.active  { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.6); }
        .sc-status-dot.inactive{ background: #6b7280; }

        .sc-info { flex: 1; min-width: 0; }
        .sc-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #f1f1f3;
          letter-spacing: -0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sc-profile {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8b5cf6;
          margin-top: 2px;
        }

        .sc-desc {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.6;
          padding: 0 18px 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sc-contacts {
          display: flex;
          gap: 8px;
          padding: 0 18px 14px;
          flex-wrap: wrap;
        }
        .sc-contact-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 99px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 11.5px;
          color: #9ca3af;
        }
        .sc-contact-pill svg { flex-shrink: 0; }

        .sc-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0 18px;
        }

        .sc-actions {
          display: flex;
          gap: 8px;
          padding: 14px 18px;
        }

        .sc-btn {
          flex: 1;
          height: 36px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: none;
          white-space: nowrap;
        }

        .sc-btn-edit {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          color: #e5e7eb;
        }
        .sc-btn-edit:hover { background: rgba(255,255,255,0.11); color: #fff; }

        .sc-btn-whatsapp {
          background: #8b5cf6;
          color: #fff;
          box-shadow: 0 0 16px rgba(139,92,246,0.3);
        }
        .sc-btn-whatsapp:hover { background: #7c3aed; box-shadow: 0 0 22px rgba(139,92,246,0.5); transform: translateY(-1px); }

        .sc-btn-delete {
          width: 36px;
          flex: none;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.15);
          color: #f87171;
        }
        .sc-btn-delete:hover { background: rgba(239,68,68,0.18); }

        .sc-btn-toggle-active {
          background: rgba(234,179,8,0.1);
          border: 1px solid rgba(234,179,8,0.2);
          color: #fbbf24;
          flex: none;
          width: 36px;
        }
        .sc-btn-toggle-active:hover { background: rgba(234,179,8,0.2); }

        .sc-btn-toggle-inactive {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          color: #34d399;
          flex: none;
          width: 36px;
        }
        .sc-btn-toggle-inactive:hover { background: rgba(16,185,129,0.2); }
      `}</style>

      <div className="sc-card">
        {/* Top — avatar + name */}
        <div className="sc-top">
          <div className="sc-avatar-wrap">
            <img className="sc-avatar" src={service.imageUrl} alt={service.name} />
            <span className={`sc-status-dot ${service.isActive ? "active" : "inactive"}`} />
          </div>
          <div className="sc-info">
            <div className="sc-name">{service.name}</div>
            <div className="sc-profile">{service.profile}</div>
          </div>
        </div>

        {/* Description */}
        <div className="sc-desc">{service.description}</div>

        {/* Contact pills */}
        <div className="sc-contacts">
          <div className="sc-contact-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {service.mobile}
          </div>
          <div className="sc-contact-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {service.whatsapp}
          </div>
        </div>

        <div className="sc-divider" />

        {/* Actions */}
        <div className="sc-actions">
          {/* Edit */}
          <button className="sc-btn sc-btn-edit" onClick={() => onEdit(service)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>

          {/* WhatsApp */}
          <button
            className="sc-btn sc-btn-whatsapp"
            onClick={() => window.open(`https://wa.me/${service.whatsapp}`, "_blank")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z"/>
            </svg>
            WhatsApp
          </button>

          {/* Toggle active */}
          <button
            className={`sc-btn ${service.isActive ? "sc-btn-toggle-active" : "sc-btn-toggle-inactive"}`}
            onClick={() => onToggle(service)}
            title={service.isActive ? "Deactivate" : "Activate"}
          >
            {service.isActive ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/>
                <line x1="2" y1="2" x2="22" y2="22"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          {/* Delete */}
          <button className="sc-btn sc-btn-delete" onClick={() => onDelete(service)} title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}