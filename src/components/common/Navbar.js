"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  },

  {
    name: "Services",
    href: "/services",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "About",
    href: "/about",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

function getActiveFromPath(pathname) {
  if (pathname === "/") return "Home";
  const match = navLinks.find(
    (l) => l.href !== "/" && pathname.startsWith(l.href)
  );
  return match?.name ?? "Home";
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
const { theme, setTheme } = useTheme();
  const [hoveredLink, setHoveredLink] = useState(null);

  const active = getActiveFromPath(pathname);
 

  // useEffect(() => {
  //   const saved = localStorage.getItem("gk-theme") || "dark";
  //   setTheme(saved);
  //   document.documentElement.setAttribute("data-theme", saved);
  // }, []);

const toggleTheme = () => {
  setTheme(theme === "dark" ? "light" : "dark");
};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root, [data-theme="dark"] {
          --red:           #DD0000;
          --red-bright:    #FF2E2E;
          --red-dim:       #a80000;
          --red-glow:      rgba(221,0,0,0.18);
          --red-soft:      rgba(221,0,0,0.08);

          --bg-base:       #080810;
          --bg-surface:    #0e0e1a;
          --bg-glass:      rgba(12,12,22,0.75);
          --bg-glass-mob:  rgba(10,10,18,0.92);
          --bg-item-hover: rgba(255,255,255,0.04);
          --bg-item-active:rgba(221,0,0,0.12);

          --text-primary:  #F0EFF8;
          --text-muted:    rgba(200,196,230,0.45);
          --text-soft:     rgba(200,196,230,0.70);
          --text-inverse:  #080810;

          --border-hair:   rgba(255,255,255,0.06);
          --border-glass:  rgba(255,255,255,0.10);
          --border-red:    rgba(221,0,0,0.35);

          --toggle-bg:     rgba(255,255,255,0.06);
          --toggle-border: rgba(255,255,255,0.10);
          --toggle-icon:   rgba(200,196,230,0.65);

          --pill-live-bg:  rgba(221,0,0,0.90);
          --shine:         rgba(255,255,255,0.03);
        }

        [data-theme="light"] {
          --red:           #CC0000;
          --red-bright:    #EE2222;
          --red-dim:       #aa0000;
          --red-glow:      rgba(204,0,0,0.14);
          --red-soft:      rgba(204,0,0,0.06);

          --bg-base:       #F8F7FF;
          --bg-surface:    #FFFFFF;
          --bg-glass:      rgba(248,247,255,0.82);
          --bg-glass-mob:  rgba(255,255,255,0.94);
          --bg-item-hover: rgba(0,0,0,0.04);
          --bg-item-active:rgba(204,0,0,0.08);

          --text-primary:  #12101E;
          --text-muted:    rgba(18,16,30,0.42);
          --text-soft:     rgba(18,16,30,0.65);
          --text-inverse:  #F8F7FF;

          --border-hair:   rgba(0,0,0,0.07);
          --border-glass:  rgba(0,0,0,0.10);
          --border-red:    rgba(204,0,0,0.25);

          --toggle-bg:     rgba(0,0,0,0.05);
          --toggle-border: rgba(0,0,0,0.10);
          --toggle-icon:   rgba(18,16,30,0.55);

          --pill-live-bg:  #CC0000;
          --shine:         rgba(255,255,255,0.50);
        }

        /* ── TOPBAR ── */
        .gk-topbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          height: 68px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-glass);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid var(--border-hair);
          transition: height 0.35s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.35s ease,
                      background 0.35s ease;
        }

        /* glass inner shine */
        .gk-topbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, var(--shine) 0%, transparent 100%);
          pointer-events: none;
        }

        /* bottom red accent line */
        .gk-topbar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--red-dim) 15%,
            var(--red) 35%,
            var(--red-bright) 50%,
            var(--red) 65%,
            var(--red-dim) 85%,
            transparent 100%
          );
          opacity: 0.7;
        }

        .gk-topbar.scrolled {
          height: 58px;
          box-shadow:
            0 1px 0 var(--border-hair),
            0 8px 32px rgba(0,0,0,0.28),
            0 2px 8px rgba(0,0,0,0.14);
        }

        /* ── BRAND ── */
        .gk-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .gk-logo-wrap {
          position: relative;
          width: 38px; height: 38px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1.5px solid var(--border-red);
          box-shadow:
            0 0 0 3px var(--red-soft),
            0 0 16px var(--red-glow);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .gk-brand:hover .gk-logo-wrap {
          transform: scale(1.05) rotate(-2deg);
          box-shadow:
            0 0 0 4px var(--red-soft),
            0 0 24px var(--red-glow);
        }

        .gk-brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 27px;
          letter-spacing: 0.06em;
          color: var(--text-primary);
          line-height: 1;
          transition: letter-spacing 0.3s ease;
        }

        .gk-brand:hover .gk-brand-name {
          letter-spacing: 0.09em;
        }

        .gk-brand-name span { color: var(--red-bright); }

        .gk-brand-pill {
          display: none;
          align-items: center;
          gap: 5px;
          padding: 3px 9px 3px 7px;
          border-radius: 20px;
          background: var(--pill-live-bg);
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #fff;
          text-transform: uppercase;
          margin-left: 6px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 2px 10px var(--red-glow);
        }

        .gk-brand-pill-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fff;
          animation: gk-pulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes gk-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }

        /* ── DESKTOP NAV ── */
        .gk-desktop-nav {
          display: none;
          align-items: center;
          gap: 2px;
          position: relative;
        }

        .gk-nav-link {
          position: relative;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 10px;
          transition:
            color 0.22s ease,
            background 0.22s ease,
            transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
          z-index: 1;
        }

        /* shimmer layer */
        .gk-nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.08) 0%,
            transparent 60%);
          opacity: 0;
          border-radius: 10px;
          transition: opacity 0.25s ease;
        }

        /* bottom indicator */
        .gk-nav-link::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%; right: 50%;
          height: 2px;
          background: var(--red-bright);
          border-radius: 2px;
          transition:
            left 0.3s cubic-bezier(0.34,1.56,0.64,1),
            right 0.3s cubic-bezier(0.34,1.56,0.64,1),
            opacity 0.3s ease;
          opacity: 0;
        }

        .gk-nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-item-hover);
          transform: translateY(-1px);
        }

        .gk-nav-link:hover::before { opacity: 1; }

        .gk-nav-link:hover::after {
          left: 22px; right: 22px;
          opacity: 0.7;
        }

        .gk-nav-link.active {
          color: #fff;
          background: var(--bg-item-active);
          border: 1px solid var(--border-red);
          font-weight: 600;
          transform: none;
        }

        .gk-nav-link.active::after {
          left: 14px; right: 14px;
          opacity: 1;
          bottom: 4px;
        }

        .gk-nav-link.active::before {
          opacity: 1;
          background: linear-gradient(135deg,
            rgba(221,0,0,0.15) 0%,
            transparent 70%);
        }

        /* ── RIGHT ── */
        .gk-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        /* ── THEME TOGGLE ── */
        .gk-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid var(--toggle-border);
          background: var(--toggle-bg);
          color: var(--toggle-icon);
          cursor: pointer;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            color 0.25s ease,
            transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.25s ease;
        }

        .gk-theme-toggle:hover {
          border-color: var(--border-red);
          color: var(--red-bright);
          background: var(--red-soft);
          transform: rotate(20deg) scale(1.1);
          box-shadow: 0 0 14px var(--red-glow);
        }

        /* ── CTA BUTTON ── */
        .gk-cta {
          display: none;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          padding: 9px 22px;
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          background: var(--red);
          border: 1px solid rgba(255,100,100,0.25);
          position: relative;
          overflow: hidden;
          transition:
            background 0.25s ease,
            transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.25s ease;
          box-shadow: 0 2px 16px var(--red-glow), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* CTA shimmer */
        .gk-cta::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg,
            transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease;
          transform: skewX(-15deg);
        }

        .gk-cta:hover {
          background: var(--red-bright);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 28px rgba(255,46,46,0.40), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .gk-cta:hover::before { left: 140%; }

        .gk-cta:active {
          transform: translateY(0) scale(0.98);
        }

        .gk-cta-icon {
          width: 13px; height: 13px;
          stroke: #fff; fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
          flex-shrink: 0;
        }

        .gk-cta:hover .gk-cta-icon { transform: translateX(3px); }

        /* ── MOBILE BOTTOM NAV ── */
        .gk-mobile-bottom {
          position: fixed;
          bottom: 14px;
          left: 12px; right: 12px;
          z-index: 50;
          background: var(--bg-glass-mob);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border-radius: 22px;
          padding: 6px 4px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border: 1px solid var(--border-glass);
          box-shadow:
            0 8px 40px rgba(0,0,0,0.35),
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 -1px 0 rgba(0,0,0,0.15) inset;
        }

        /* mobile nav shine */
        .gk-mobile-bottom::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent, rgba(255,255,255,0.14), transparent);
          border-radius: 1px;
        }

        .gk-mob-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 7px 12px;
          border-radius: 16px;
          cursor: pointer;
          text-decoration: none;
          transition:
            background 0.22s ease,
            transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .gk-mob-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.10) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .gk-mob-link.active {
          background: var(--red);
          box-shadow:
            0 3px 14px var(--red-glow),
            inset 0 1px 0 rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }

        .gk-mob-link.active::before { opacity: 1; }

        .gk-mob-icon {
          width: 20px; height: 20px;
          stroke: var(--text-muted);
          fill: none;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.22s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        .gk-mob-link.active .gk-mob-icon {
          stroke: #fff;
          transform: scale(1.1);
        }

        .gk-mob-label {
          font-family: 'Outfit', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-muted);
          transition: color 0.22s ease;
        }

        .gk-mob-link.active .gk-mob-label {
          color: #fff;
          font-weight: 700;
        }

        .gk-mob-theme {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 7px 12px;
          border-radius: 16px;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: background 0.22s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          flex: 1;
        }

        .gk-mob-theme:hover {
          background: var(--bg-item-hover);
          transform: translateY(-1px);
        }

        .gk-mob-theme-icon {
          width: 20px; height: 20px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gk-mob-theme-label {
          font-family: 'Outfit', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* ── RESPONSIVE ── */
        @media (min-width: 768px) {
          .gk-mobile-bottom { display: none; }
          .gk-desktop-nav   { display: flex; }
          .gk-cta           { display: inline-flex; }
          .gk-brand-pill    { display: flex; }
        }

        @media (max-width: 767px) {
          .gk-topbar { padding: 0 16px; height: 60px; }
        }
      `}</style>

      {/* ── Top Bar ── */}
      <header className={`gk-topbar${scrolled ? " scrolled" : ""}`}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="gk-brand">
            <div className="gk-logo-wrap">
              <Image
                src="/logo.png"
                alt="GuptKhabre"
                width={66}
                height={66}
                priority
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <span className="gk-brand-name">
              Gupt<span>Khabre</span>
            </span>
          </Link>

          <div className="gk-brand-pill">
            <div className="gk-brand-pill-dot" />
            Live
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="gk-desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`gk-nav-link${active === link.name ? " active" : ""}`}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="gk-right">
          {/* <button
            className="gk-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button> */}

          <Link href="/services" className="gk-cta">
            Find Experts
            <svg className="gk-cta-icon" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="gk-mobile-bottom" aria-label="Mobile navigation">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`gk-mob-link${active === link.name ? " active" : ""}`}
          >
            <svg className="gk-mob-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d={link.icon} />
            </svg>
            <span className="gk-mob-label">{link.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}