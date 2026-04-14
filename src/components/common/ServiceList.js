"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import ServiceCard, { ServiceCardSkeleton } from "./ServiceCard";
import Link from "next/link";

const PAGE_SIZE = 12;
const SKELETON_COUNT = 6;

function useDebounce(value, delay = 280) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ServiceList({ services = [] }) {
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("newest");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const loaderRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const debouncedSearch = useDebounce(search);

  const safeServices = useMemo(() =>
    Array.isArray(services) ? services : services?.services || services?.data || [],
    [services]
  );

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    let out = safeServices.filter((s) => {
      if (!q) return true;
      return (
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.profile?.toLowerCase().includes(q) ||
        s.mobile?.includes(q)
      );
    });
    if (sortBy === "newest")      out = [...out].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") out = [...out].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "name")   out = [...out].sort((a, b) => a.name?.localeCompare(b.name));
    else if (sortBy === "active") out = [...out].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
    return out;
  }, [debouncedSearch, sortBy, safeServices]);

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setPage((p) => p + 1); },
      { rootMargin: "300px" }
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore]);

  const handleClear = useCallback(() => {
    setSearch(""); setSortBy("newest");
    inputRef.current?.focus();
  }, []);

  const hasFilters = search || sortBy !== "newest";

  return (
    <div className="page-root">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-pattern" />

        <div className="hero-inner">
          {/* Left: headline */}
          <div className="hero-left">
           

            <h1 className="hero-title">
              Trusted Experts,<br />
              <em className="hero-em">Ready to Help</em>
            </h1>
            <p className="hero-sub">
              Every professional on this directory is verified and vetted. Browse, search, and connect with confidence.
            </p>

            <div className="hero-stats">
              <div className="hstat">
                <span className="hstat-num">{safeServices.length.toLocaleString()}+</span>
                <span className="hstat-lbl">Professionals</span>
              </div>
              <div className="hstat-sep" />
              <div className="hstat">
                <span className="hstat-num">100%</span>
                <span className="hstat-lbl">Verified</span>
              </div>
              <div className="hstat-sep" />
              <div className="hstat">
                <span className="hstat-num red">Free</span>
                <span className="hstat-lbl">To Contact</span>
              </div>
            </div>
          </div>

          {/* Right: trust card panel */}
          <div className="hero-right" aria-hidden="true">
            <div className="trust-panel">
              <div className="trust-icon-row">
                <div className="ticon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#c8102e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="ticon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#c8102e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 1.16 2 2 0 014 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.91 8.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div className="ticon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#c8102e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
              </div>
              <p className="trust-panel-title">Why trust us?</p>
              {[
                "Every listing manually reviewed",
                "Direct contact — no middleman",
                "Active professionals only",
              ].map((t) => (
                <div key={t} className="trust-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Search bar ── */}
      <section className="search-section">
        <div className="search-wrap-outer">
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              className="search-input"
              placeholder="Search by name, role, or phone number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {search && (
              <button className="search-x" onClick={() => { setSearch(""); inputRef.current?.focus(); }}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13"/>
                </svg>
              </button>
            )}
          </div>

          <div className="bar-controls">
            <select className="sort-sel" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A–Z</option>
              <option value="active">Available First</option>
            </select>
            {hasFilters && (
              <button className="reset-btn" onClick={handleClear}>Reset</button>
            )}
          </div>
        </div>

        {debouncedSearch && !loading && (
          <p className="result-text">
            Found <strong>{filtered.length}</strong> professional{filtered.length !== 1 ? "s" : ""} matching{" "}
            <span className="q-text">"{debouncedSearch}"</span>
          </p>
        )}
      </section>

      {/* ── Grid ── */}
      <section className="grid-section">
        {loading ? (
          <div className="card-grid">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="#d1ccc4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <p className="empty-title">No professionals found</p>
            <p className="empty-sub">Try searching with a different name or keyword</p>
            {hasFilters && (
              <button onClick={handleClear} className="empty-btn">Clear Search</button>
            )}
          </div>
        ) : (
          <>
            <div className="card-grid">
              {visible.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
            {hasMore && (
              <div ref={loaderRef} className="loader">
                {[0,1,2].map((i) => (
                  <span key={i} className="ldot" style={{ animationDelay: `${i * 0.14}s` }} />
                ))}
              </div>
            )}
            {!hasMore && visible.length > PAGE_SIZE && (
              <p className="end-msg">— All {filtered.length} professionals loaded —</p>
            )}
          </>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-left">
            <p className="cta-tag">For Professionals</p>
            <h2 className="cta-title">
              Grow your client base.<br />
              <span className="cta-red">Join the directory today.</span>
            </h2>
            <p className="cta-sub">
              Get discovered by hundreds of potential clients looking for your expertise — completely free.
            </p>
            <Link href="/about">
              <button className="cta-btn">Join Now — It's Free →</button>
            </Link>
          </div>
          <div className="cta-right" aria-hidden="true">
            <div className="cta-deco-num">{safeServices.length || "∞"}</div>
            <p className="cta-deco-lbl">professionals<br />already listed</p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page-root {
          background: #f7f4ef;
          color: #111;
          min-height: 100svh;
          width: 100%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          background: #111;
          overflow: hidden;
          padding: clamp(72px,12vw,120px) clamp(16px,5vw,64px) clamp(48px,8vw,80px);
        }
        .hero-pattern {
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,.03) 39px, rgba(255,255,255,.03) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,.03) 39px, rgba(255,255,255,.03) 40px);
          pointer-events: none;
        }
        .hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center;
          gap: clamp(32px, 6vw, 72px);
          flex-wrap: wrap;
        }
        .hero-left { flex: 1; min-width: min(300px, 100%); }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          background: rgba(200,16,46,.15);
          border: 1px solid rgba(200,16,46,.3);
          font-size: clamp(10px,2.5vw,11px); font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; color: #f07080;
          margin-bottom: clamp(16px,4vw,24px);
        }

        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(32px,8vw,68px);
          font-weight: 800; color: #fff; line-height: 1.08;
          letter-spacing: -.02em;
          margin-bottom: clamp(14px,3vw,22px);
        }
        .hero-em {
          font-style: italic;
          color: #c8102e;
          -webkit-text-stroke: 0;
        }
        .hero-sub {
          font-size: clamp(13px,3vw,16px); color: #9ca3af;
          line-height: 1.78; max-width: 480px;
          margin-bottom: clamp(24px,5vw,36px);
        }

        .hero-stats {
          display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
        }
        .hstat { display: flex; flex-direction: column; gap: 2px; }
        .hstat-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px,5vw,32px); font-weight: 800; color: #fff; line-height: 1;
        }
        .hstat-num.red { color: #c8102e; }
        .hstat-lbl {
          font-size: clamp(10px,2.2vw,11px); font-weight: 600;
          text-transform: uppercase; letter-spacing: .1em; color: #6b7280;
        }
        .hstat-sep { width: 1px; height: 36px; background: #2a2a2a; }

        /* Trust panel */
        .hero-right { flex-shrink: 0; }
        .trust-panel {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: clamp(20px,4vw,28px);
          min-width: clamp(220px, 32vw, 300px);
          max-width: 300px;
        }
        .trust-icon-row {
          display: flex; gap: 10px; margin-bottom: 18px;
        }
        .ticon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(200,16,46,.1);
          border: 1px solid rgba(200,16,46,.2);
          display: flex; align-items: center; justify-content: center;
        }
        .trust-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px,3.5vw,18px); font-weight: 700;
          color: #fff; margin-bottom: 14px;
        }
        .trust-item {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 0; border-bottom: 1px solid #222;
          font-size: clamp(11px,2.5vw,13px); color: #9ca3af; font-weight: 500;
        }
        .trust-item:last-child { border-bottom: none; }

        /* ── Search ── */
        .search-section {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(24px,5vw,40px) clamp(16px,5vw,64px) 0;
        }
        .search-wrap-outer {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8e3db;
          box-shadow: 0 4px 28px rgba(0,0,0,.07);
          padding: clamp(14px,3.5vw,18px) clamp(16px,4vw,22px);
          display: flex; flex-direction: column; gap: 12px;
        }
        @media (min-width: 600px) {
          .search-wrap-outer { flex-direction: row; align-items: center; gap: 14px; }
        }

        .search-bar {
          position: relative; flex: 1; min-width: 0;
        }
        .search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); color: #bbb; pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: #faf8f5;
          border: 1.5px solid #e8e3db;
          border-radius: 10px;
          padding: clamp(11px,3vw,13px) 40px clamp(11px,3vw,13px) 46px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(13px,3.2vw,15px); font-weight: 500;
          color: #111; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .search-input::placeholder { color: #bbb; }
        .search-input:focus {
          border-color: #c8102e;
          box-shadow: 0 0 0 3px rgba(200,16,46,.1);
          background: #fff;
        }
        .search-x {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          background: #f0ece6; border: none; border-radius: 6px;
          color: #999; cursor: pointer;
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s, color .15s;
        }
        .search-x:hover { background: #c8102e; color: #fff; }

        .bar-controls {
          display: flex; gap: 8px; align-items: center; flex-shrink: 0;
        }
        .sort-sel {
          background: #faf8f5; border: 1.5px solid #e8e3db;
          color: #555; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(11px,2.8vw,13px); font-weight: 600;
          border-radius: 10px;
          padding: clamp(11px,3vw,13px) clamp(10px,2.5vw,14px);
          cursor: pointer; outline: none;
          transition: border-color .2s;
        }
        .sort-sel:focus { border-color: #c8102e; }

        .reset-btn {
          padding: clamp(11px,3vw,13px) clamp(14px,3vw,18px);
          background: #fff8f8; border: 1.5px solid #fecdd3;
          border-radius: 10px; color: #c8102e;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(11px,2.5vw,12px); font-weight: 700;
          cursor: pointer; white-space: nowrap;
          transition: background .18s;
        }
        .reset-btn:hover { background: #fee2e2; }

        .result-text {
          margin-top: 12px;
          font-size: clamp(12px,2.8vw,13px); color: #9ca3af;
        }
        .result-text strong { color: #111; }
        .q-text { color: #c8102e; }

        /* ── Grid ── */
        .grid-section {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(24px,5vw,44px) clamp(16px,5vw,64px) clamp(40px,8vw,80px);
        }
        .card-grid {
          display: grid;
          gap: clamp(12px,3vw,20px);
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px) { .card-grid { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 860px) { .card-grid { grid-template-columns: repeat(3,1fr); } }
        @media (min-width: 1200px){ .card-grid { grid-template-columns: repeat(4,1fr); } }

        /* ── Empty ── */
        .empty {
          text-align: center; padding: clamp(60px,14vw,120px) 20px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .empty-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: #fff; border: 1px solid #e8e3db;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 6px;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
        }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px,5vw,28px); font-weight: 700; color: #374151;
        }
        .empty-sub { font-size: 14px; color: #9ca3af; }
        .empty-btn {
          margin-top: 10px;
          padding: 11px 28px; background: #c8102e; border: none;
          border-radius: 999px; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: opacity .2s;
          box-shadow: 0 4px 16px rgba(200,16,46,.3);
        }
        .empty-btn:hover { opacity: .88; }

        /* ── Loader ── */
        .loader {
          display: flex; justify-content: center; align-items: center;
          gap: 7px; padding: clamp(28px,6vw,48px) 0;
        }
        .ldot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #c8102e;
          animation: ldot .9s ease-in-out infinite;
        }
        @keyframes ldot {
          0%,100%{transform:translateY(0);opacity:1}
          50%{transform:translateY(-8px);opacity:.3}
        }
        .end-msg {
          text-align: center; font-size: 11px;
          letter-spacing: .2em; text-transform: uppercase;
          color: #c9c4bc; padding: clamp(18px,4vw,32px) 0;
        }

        /* ── CTA ── */
        .cta-section {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(16px,5vw,64px) clamp(48px,10vw,96px);
        }
        .cta-box {
          background: #111;
          border-radius: 20px;
          padding: clamp(36px,8vw,64px) clamp(24px,6vw,60px);
          display: flex; align-items: center;
          justify-content: space-between;
          gap: clamp(24px,5vw,48px);
          flex-wrap: wrap;
          overflow: hidden;
          position: relative;
        }
        .cta-box::before {
          content: '';
          position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(200,16,46,.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-left { position: relative; z-index: 1; max-width: 540px; }
        .cta-tag {
          font-size: 10px; font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase; color: #c8102e;
          margin-bottom: clamp(10px,2.5vw,14px);
        }
        .cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(24px,6vw,44px); font-weight: 800;
          color: #fff; line-height: 1.15; letter-spacing: -.02em;
          margin-bottom: clamp(10px,2.5vw,14px);
        }
        .cta-red { color: #c8102e; font-style: italic; }
        .cta-sub {
          font-size: clamp(13px,3vw,15px); color: #6b7280;
          line-height: 1.75; margin-bottom: clamp(22px,5vw,32px);
        }
        .cta-btn {
          display: inline-flex; align-items: center;
          padding: clamp(13px,3vw,16px) clamp(24px,5vw,36px);
          background: #c8102e; color: #fff; border: none; border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(13px,3vw,15px); font-weight: 700;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
          box-shadow: 0 6px 24px rgba(200,16,46,.35);
          -webkit-tap-highlight-color: transparent;
          letter-spacing: .02em;
        }
        .cta-btn:hover  { opacity: .9; }
        .cta-btn:active { transform: scale(0.97); }

        .cta-right {
          position: relative; z-index: 1;
          text-align: center; flex-shrink: 0;
        }
        .cta-deco-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(56px,14vw,100px); font-weight: 800;
          color: rgba(255,255,255,.06); line-height: 1;
          letter-spacing: -.04em;
        }
        .cta-deco-lbl {
          font-size: clamp(11px,2.5vw,13px); color: #4b5563;
          font-weight: 600; text-transform: uppercase;
          letter-spacing: .1em; line-height: 1.5;
          margin-top: -8px;
        }
      `}</style>
    </div>
  );
}