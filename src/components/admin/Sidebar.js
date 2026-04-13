"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    mobileLabel: "Home",
  },
  {
    label: "All Posts",
    href: "/admin/posts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    mobileLabel: "Posts",
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    mobileLabel: "Services",
  },
  {
    label: "Enquiries",
    href: "/admin/enquiry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    mobileLabel: "Enquiries",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    mobileLabel: "Settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Prevent body scroll issues on mobile — no drawer needed
  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg-sidebar: #0d0d0f;
          --bg-active: rgba(124,58,237,0.18);
          --border: rgba(255,255,255,0.07);
          --accent: #7c3aed;
          --accent-glow: rgba(124,58,237,0.4);
          --accent-light: #a78bfa;
          --teal: #06b6d4;
          --text-primary: #f1f1f3;
          --text-muted: #6b7280;
          --text-nav: #9ca3af;
          --sidebar-w: 240px;
          --sidebar-w-collapsed: 72px;
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --mobile-nav-h: 72px;
        }

        .sidebar-root { font-family: 'DM Sans', sans-serif; }

        /* ── Desktop Sidebar ── */
        .sidebar-desktop {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: var(--sidebar-w);
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: width var(--transition);
          overflow: hidden;
        }
        .sidebar-desktop.collapsed { width: var(--sidebar-w-collapsed); }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px 16px;
          border-bottom: 1px solid var(--border);
          min-height: 68px;
          flex-shrink: 0;
        }
        .logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--accent), #4f46e5);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 16px var(--accent-glow);
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 13px; color: #fff; letter-spacing: -0.5px;
        }
        .logo-text {
          overflow: hidden;
          transition: opacity var(--transition), width var(--transition);
          white-space: nowrap;
        }
        .sidebar-desktop.collapsed .logo-text { opacity: 0; width: 0; }
        .logo-name {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
          color: var(--text-primary); line-height: 1.1;
        }
        .logo-name span { color: var(--teal); }
        .logo-sub {
          font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-muted); margin-top: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex; flex-direction: column; gap: 2px;
          overflow-y: auto; overflow-x: hidden; scrollbar-width: none;
        }
        .sidebar-nav::-webkit-scrollbar { display: none; }

        .nav-label {
          font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted); padding: 8px 8px 4px;
          white-space: nowrap; overflow: hidden;
          transition: opacity var(--transition);
        }
        .sidebar-desktop.collapsed .nav-label { opacity: 0; }

        .nav-item {
          position: relative; display: flex; align-items: center; gap: 12px;
          padding: 10px 10px; border-radius: 10px; color: var(--text-nav);
          text-decoration: none; transition: background var(--transition), color var(--transition);
          cursor: pointer; white-space: nowrap; overflow: hidden;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .nav-item.active { background: var(--bg-active); color: var(--accent-light); }
        .nav-item.active .nav-icon { color: var(--accent-light); }
        .nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 0 2px 2px 0;
          background: var(--accent-light); box-shadow: 0 0 8px var(--accent-glow);
        }
        .nav-icon {
          width: 20px; height: 20px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-text {
          font-size: 13.5px; font-weight: 500;
          transition: opacity var(--transition), width var(--transition); overflow: hidden;
        }
        .sidebar-desktop.collapsed .nav-text { opacity: 0; width: 0; }

        .nav-item .tooltip {
          display: none; position: absolute; left: calc(100% + 12px); top: 50%;
          transform: translateY(-50%); background: #1a1a2e; border: 1px solid var(--border);
          color: var(--text-primary); font-size: 12px; padding: 5px 10px;
          border-radius: 7px; white-space: nowrap; pointer-events: none;
          z-index: 999; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .sidebar-desktop.collapsed .nav-item:hover .tooltip { display: block; }

        /* Logout in desktop sidebar */
        .desktop-logout {
          margin: 0 10px 12px;
          display: flex; align-items: center; gap: 10px;
          padding: 10px 10px; border-radius: 10px;
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18);
          color: #f87171; font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all var(--transition); overflow: hidden; white-space: nowrap;
        }
        .desktop-logout:hover { background: rgba(239,68,68,0.16); }
        .desktop-logout-label {
          transition: opacity var(--transition), width var(--transition);
        }
        .sidebar-desktop.collapsed .desktop-logout-label { opacity: 0; width: 0; overflow: hidden; }

        .collapse-btn {
          margin: 0 10px 10px;
          padding: 10px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          border-radius: 10px; color: var(--text-muted); cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          transition: all var(--transition); overflow: hidden; white-space: nowrap;
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.06); color: var(--text-primary); }
        .collapse-btn svg { flex-shrink: 0; transition: transform var(--transition); }
        .sidebar-desktop.collapsed .collapse-btn svg { transform: rotate(180deg); }
        .collapse-btn span {
          font-size: 12.5px; font-weight: 500; transition: opacity var(--transition);
        }
        .sidebar-desktop.collapsed .collapse-btn span { opacity: 0; width: 0; overflow: hidden; }

        /* ── Mobile Bottom Bar ── */
        .mobile-bottom-bar {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: var(--mobile-nav-h);
          background: rgba(10,10,12,0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255,255,255,0.09);
          z-index: 200;
          padding: 0 2px env(safe-area-inset-bottom, 8px);
          align-items: center;
          justify-content: space-around;
        }

        .mob-nav-btn {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          flex: 1; padding: 8px 0 4px;
          background: none; border: none; cursor: pointer;
          color: #6b7280; position: relative;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          transition: color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mob-nav-btn:active { transform: scale(0.94); }
        .mob-nav-btn.active { color: #a78bfa; }

        .mob-icon-wrap {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px;
          transition: background 0.15s;
        }
        .mob-nav-btn.active .mob-icon-wrap { background: rgba(124,58,237,0.2); }

        /* Floating add button */
        .mob-add-btn .mob-icon-wrap {
          width: 44px; height: 44px;
          background: #7c3aed;
          border-radius: 14px;
          margin-top: -10px;
          box-shadow: 0 4px 18px rgba(124,58,237,0.55);
        }
        .mob-add-btn { color: #a78bfa !important; }

        .mob-nav-label {
          font-size: 9.5px; font-weight: 500; letter-spacing: 0.01em;
          white-space: nowrap;
        }

        /* Active dot indicator */
        .mob-active-dot {
          display: none; position: absolute; bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #a78bfa;
        }
        .mob-nav-btn.active .mob-active-dot { display: block; }
        .mob-add-btn .mob-active-dot { display: none !important; }

        /* Logout tab — red tint */
        .mob-logout-btn { color: #f87171 !important; }
        .mob-logout-btn .mob-icon-wrap { background: transparent; }
        .mob-logout-btn:active .mob-icon-wrap { background: rgba(239,68,68,0.15); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-bottom-bar { display: flex; }
        }
        @media (min-width: 769px) {
          .mobile-bottom-bar { display: none !important; }
        }
      `}</style>

      <div className="sidebar-root">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className={`sidebar-desktop${collapsed ? " collapsed" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">GK</div>
            <div className="logo-text">
              <div className="logo-name">Gupt<span>Khabre</span></div>
              <div className="logo-sub">Admin Console</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-label">Main Menu</div>
            {navItems.slice(0, 4).map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`nav-item${active ? " active" : ""}`}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <span className="tooltip">{item.label}</span>
                </Link>
              );
            })}

            <div className="nav-label" style={{ marginTop: 8 }}>System</div>
            {navItems.slice(4).map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`nav-item${active ? " active" : ""}`}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <span className="tooltip">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout inside sidebar — no confirm modal needed on desktop, kept as-is from Topbar */}
          

          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
            <span>Collapse</span>
          </button>
        </aside>

        {/* ── MOBILE BOTTOM BAR ── All items visible, no three-dot drawer ── */}
        <nav className="mobile-bottom-bar">

          {/* Dashboard */}
          <Link href="/admin/dashboard" className={`mob-nav-btn${pathname === "/admin/dashboard" ? " active" : ""}`}>
            <div className="mob-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="mob-nav-label">Home</span>
            <span className="mob-active-dot" />
          </Link>

          {/* All Posts */}
          <Link href="/admin/posts" className={`mob-nav-btn${pathname === "/admin/posts" ? " active" : ""}`}>
            <div className="mob-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="mob-nav-label">Posts</span>
            <span className="mob-active-dot" />
          </Link>

          {/* Add Post — floating accent button in center */}
          <button
            className="mob-nav-btn mob-add-btn"
            onClick={() => {
              /* Trigger the Add Post modal — wire to your existing showModal state via a shared event/context */
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-add-post-modal"));
              }
            }}
          >
            <div className="mob-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="mob-nav-label">Add Post</span>
          </button>

          {/* Services */}
          <Link href="/admin/services" className={`mob-nav-btn${pathname === "/admin/services" ? " active" : ""}`}>
            <div className="mob-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="mob-nav-label">Services</span>
            <span className="mob-active-dot" />
          </Link>

          {/* Logout */}
          <button
            className="mob-nav-btn mob-logout-btn"
            onClick={() => {
              /* Wire to your existing logout confirm — kept identical to Topbar logic */
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-logout-confirm"));
              }
            }}
          >
            <div className="mob-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <span className="mob-nav-label">Logout</span>
          </button>

        </nav>

      </div>
    </>
  );
}