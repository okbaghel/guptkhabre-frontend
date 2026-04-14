"use client";

import Image from "next/image";

/* ─── Skeleton ─────────────────────────────────────────────────────── */
export function ServiceCardSkeleton() {
  return (
    <div className="sk-card">
      <div className="sk-top pulse-bg" />
      <div className="sk-body">
        <div className="sk-avatar-wrap">
          <div className="sk-avatar pulse" />
        </div>
        <div className="sk-lines">
          <div className="sk-line w70 pulse" />
          <div className="sk-line w45 pulse" />
          <div className="sk-line w30 pulse" />
        </div>
        <div className="sk-desc pulse" />
        <div className="sk-desc sk-desc-short pulse" />
        <div className="sk-btns">
          <div className="sk-btn pulse" />
          <div className="sk-btn pulse" />
        </div>
      </div>
      <style jsx>{`
        .sk-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #ece8e1;
          box-shadow: 0 2px 20px rgba(0,0,0,.06);
        }
        .sk-top { height: 6px; background: #ece8e1; }
        .sk-body { padding: clamp(18px,5vw,26px); }
        .sk-avatar-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
        .sk-avatar {
          width: clamp(64px,18vw,82px); height: clamp(64px,18vw,82px);
          border-radius: 50%; background: #ece8e1;
        }
        .sk-lines { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 18px; }
        .sk-line { height: 13px; border-radius: 7px; background: #ece8e1; }
        .w70 { width: 70%; }
        .w45 { width: 45%; }
        .w30 { width: 30%; }
        .sk-desc { height: 11px; border-radius: 6px; background: #ece8e1; margin-bottom: 8px; }
        .sk-desc-short { width: 55%; }
        .sk-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
        .sk-btn { height: 44px; border-radius: 12px; background: #ece8e1; }
        .pulse { animation: pulse 1.6s ease-in-out infinite; }
        .pulse-bg { animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
      `}</style>
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────────────────── */
export default function ServiceCard({ service }) {
  const isActive = service.isActive !== false;

  const formattedDate = service.createdAt
    ? new Date(service.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="card">
      {/* Top accent stripe */}
      <div className="card-stripe" />

      <div className="card-body">

        {/* ── Avatar centered ── */}
        <div className="avatar-section">
          <div className="avatar-ring">
            <div className="avatar-img">
              <Image
                src={service.imageUrl || "/logo.png"}
                alt={service.name}
                fill
                className="object-cover"
                sizes="(max-width: 380px) 72px, 88px"
              />
            </div>
            <div className="verified-badge" title="Verified Professional">
              <svg width="9" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Live badge top-right */}
          <span className={`status-pill ${isActive ? "s-live" : "s-off"}`}>
            <span className={`s-dot ${isActive ? "s-dot-live" : ""}`} />
            {isActive ? "Available" : "Offline"}
          </span>
        </div>

        {/* ── Name & role centered ── */}
        <div className="identity">
          <h3 className="prof-name">{service.name}</h3>
          <p className="prof-role">{service.profile}</p>
          {formattedDate && (
            <p className="prof-since">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ display:"inline", verticalAlign:"middle", marginRight:4 }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Member since {formattedDate}
            </p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── Description ── */}
        <p className="prof-desc">{service.description}</p>

        {/* ── Trust badges ── */}
        <div className="trust-row">
          <span className="trust-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Verified
          </span>
          <span className="trust-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Trusted
          </span>
          <span className="trust-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Responsive
          </span>
        </div>

        {/* ── Action buttons ── */}
        <div className="actions">
          <a href={`tel:${service.mobile}`} className="btn btn-call">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 1.16 2 2 0 014 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.91 8.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call Now
          </a>
          <a
            href={`https://wa.me/${service.whatsapp}`}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-wa"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      <style jsx>{`
        .card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #ece8e1;
          box-shadow: 0 4px 24px rgba(0,0,0,.07);
          transition: box-shadow .3s ease, transform .25s ease;
          will-change: transform;
          -webkit-tap-highlight-color: transparent;
        }
        .card:hover {
          box-shadow: 0 12px 48px rgba(0,0,0,.13);
          transform: translateY(-4px);
        }
        .card:active { transform: scale(0.99); }

        /* stripe */
        .card-stripe {
          height: 5px;
          background: linear-gradient(90deg, #c8102e, #e8354d);
        }

        .card-body { padding: clamp(18px,5vw,26px); }

        /* Avatar */
        .avatar-section {
          display: flex; justify-content: center;
          position: relative;
          margin-bottom: clamp(14px,4vw,20px);
        }
        .avatar-ring {
          position: relative;
          padding: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8102e, #f5a623);
          box-shadow: 0 4px 20px rgba(200,16,46,.25);
        }
        .avatar-img {
          position: relative;
          width: clamp(68px,18vw,88px); height: clamp(68px,18vw,88px);
          border-radius: 50%; overflow: hidden;
          border: 3px solid #fff;
        }
        .verified-badge {
          position: absolute; bottom: 2px; right: 2px;
          width: 22px; height: 22px; border-radius: 50%;
          background: #c8102e;
          border: 2.5px solid #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(200,16,46,.4);
        }

        /* Status */
        .status-pill {
          position: absolute; top: 0; right: 0;
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(9px,2vw,10px); font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
        }
        .s-live {
          background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
        }
        .s-off {
          background: #f9fafb; border: 1px solid #e5e7eb; color: #9ca3af;
        }
        .s-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #d1d5db;
        }
        .s-dot-live {
          background: #22c55e;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }

        /* Identity */
        .identity { text-align: center; margin-bottom: clamp(14px,3.5vw,18px); }
        .prof-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(17px,5vw,22px);
          font-weight: 700; color: #111; line-height: 1.2;
          margin: 0 0 6px;
          letter-spacing: -.01em;
        }
        .prof-role {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(10px,2.5vw,11px);
          font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
          color: #c8102e; margin: 0 0 5px;
        }
        .prof-since {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(10px,2.2vw,11px); color: #9ca3af; margin: 0;
        }

        /* Divider */
        .divider {
          height: 1px; background: #f0ece6;
          margin: clamp(12px,3vw,16px) 0;
        }

        /* Description */
        .prof-desc {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(12.5px,3.2vw,13.5px); color: #6b7280;
          line-height: 1.72; margin-bottom: clamp(14px,3.5vw,18px);
          display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          text-align: center;
        }

        /* Trust badges */
        .trust-row {
          display: flex; justify-content: center;
          gap: 8px; flex-wrap: wrap;
          margin-bottom: clamp(16px,4vw,20px);
        }
        .trust-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 999px;
          background: #fafaf9; border: 1px solid #e8e4de;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(9px,2.2vw,10.5px); font-weight: 700;
          color: #6b7280; letter-spacing: .04em;
        }
        .trust-badge svg { color: #c8102e; flex-shrink: 0; }

        /* Actions */
        .actions {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(8px,2.5vw,10px);
        }
        .btn {
          display: flex; align-items: center; justify-content: center;
          gap: 7px;
          padding: clamp(11px,3vw,14px) 8px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(12px,3vw,13px); font-weight: 700;
          text-decoration: none;
          transition: opacity .18s, transform .14s, box-shadow .18s;
          -webkit-tap-highlight-color: transparent;
          letter-spacing: .02em;
        }
        .btn:active { transform: scale(0.96); }

        .btn-call {
          background: #fff; color: #111;
          border: 1.5px solid #e0dbd3;
          box-shadow: 0 1px 6px rgba(0,0,0,.06);
        }
        .btn-call:hover {
          border-color: #c8102e; color: #c8102e;
          box-shadow: 0 2px 14px rgba(200,16,46,.12);
        }

        .btn-wa {
          background: linear-gradient(135deg, #c8102e, #e8354d);
          color: #fff; border: none;
          box-shadow: 0 4px 18px rgba(200,16,46,.3);
        }
        .btn-wa:hover { opacity: .9; box-shadow: 0 6px 24px rgba(200,16,46,.38); }
      `}</style>
    </div>
  );
}