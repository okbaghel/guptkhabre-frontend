"use client";
import { createContact } from "@/module/contact/contactService";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';

export default function About() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    purpose: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((prev) => ({ ...prev, [e.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ref = (id) => (el) => {
    sectionRefs.current[id] = el;
    if (el) el.dataset.id = id;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  

  try {
    await createContact(formData); // 🔥 using apiClient
    console.log(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);

    setFormData({
      name: "",
      contact: "",
      purpose: "",
      message: "",
    });

  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to send message");
  }
};

  const stats = [
    { value: "50K+", label: "Monthly Readers" },
    { value: "200+", label: "Verified Experts" },
    { value: "15+", label: "Cities Covered" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const experts = [
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Legal Experts",
      desc: "Connect with top-tier lawyers and legal advisors for confidential consultations.",
      count: "40+ Lawyers",
    },
    {
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      title: "Medical Specialists",
      desc: "Board-certified doctors and health experts available for private guidance.",
      count: "60+ Doctors",
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Financial Advisors",
      desc: "Trusted investment and financial planning experts for your wealth goals.",
      count: "35+ Advisors",
    },
    {
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      title: "Tech Consultants",
      desc: "Expert technologists and startup mentors to help scale your digital ventures.",
      count: "50+ Experts",
    },
    {
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      title: "Real Estate",
      desc: "Licensed agents and property consultants for transparent, verified deals.",
      count: "25+ Agents",
    },
    {
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      title: "Education Guides",
      desc: "Academic counsellors and career coaches for students and professionals.",
      count: "30+ Counsellors",
    },
  ];

  const values = [
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Verified Sources",
      desc: "Every expert and every story is rigorously vetted before publication.",
    },
    {
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      title: "Radical Transparency",
      desc: "No hidden agendas. No paid placements. Pure information, always.",
    },
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      title: "Absolute Privacy",
      desc: "Your inquiries stay private. We never share your data with third parties.",
    },
  ];

  const purposes = [
    "General Inquiry",
    "Expert Consultation",
    "News Tip / Leak",
    "Partnership",
    "Media Enquiry",
    "Other",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        /* ─── CSS VARS (mirror navbar) ─── */
        :root, [data-gk-theme="dark"] {
          --red: #DD0000; --red-bright: #FF2E2E; --red-dim: #a80000;
          --red-glow: rgba(221,0,0,0.18); --red-soft: rgba(221,0,0,0.08);
          --bg-base: #080810; --bg-surface: #0e0e1a;
          --bg-glass: rgba(12,12,22,0.75); --border-hair: rgba(255,255,255,0.06);
          --border-glass: rgba(255,255,255,0.10); --border-red: rgba(221,0,0,0.35);
          --text-primary: #F0EFF8; --text-muted: rgba(200,196,230,0.45);
          --text-soft: rgba(200,196,230,0.70);
          --card-bg: rgba(14,14,26,0.80); --card-hover: rgba(20,20,35,0.95);
          --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        [data-gk-theme="light"] {
          --red: #CC0000; --red-bright: #EE2222; --red-dim: #aa0000;
          --red-glow: rgba(204,0,0,0.14); --red-soft: rgba(204,0,0,0.06);
          --bg-base: #F8F7FF; --bg-surface: #FFFFFF;
          --bg-glass: rgba(248,247,255,0.82); --border-hair: rgba(0,0,0,0.07);
          --border-glass: rgba(0,0,0,0.10); --border-red: rgba(204,0,0,0.25);
          --text-primary: #12101E; --text-muted: rgba(18,16,30,0.42);
          --text-soft: rgba(18,16,30,0.65);
          --card-bg: rgba(255,255,255,0.90); --card-hover: #fff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ab-page {
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          padding-top: 68px;
        }

        /* ── SCROLL REVEAL ── */
        .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .reveal.visible { opacity: 1; transform: none; }
        .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .reveal-left.visible { opacity: 1; transform: none; }
        .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .reveal-right.visible { opacity: 1; transform: none; }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }

        /* ── HERO ── */
        .ab-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 100px;
          overflow: hidden;
        }

        .ab-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% 60%, rgba(221,0,0,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(221,0,0,0.07) 0%, transparent 60%),
            var(--bg-base);
        }

        /* animated diagonal lines */
        .ab-hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 60px,
            rgba(255,255,255,0.015) 60px,
            rgba(255,255,255,0.015) 61px
          );
          pointer-events: none;
        }

        .ab-hero-content {
          position: relative; z-index: 1;
          text-align: center;
          max-width: 860px;
        }

        .ab-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-red);
          background: var(--red-soft);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--red-bright);
          margin-bottom: 28px;
        }

        .ab-hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red-bright);
          animation: gk-pulse 1.8s ease-in-out infinite;
        }

        @keyframes gk-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.65); }
        }

        .ab-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 110px);
          letter-spacing: 0.04em;
          line-height: 0.95;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .ab-hero-title em {
          font-style: normal;
          color: var(--red-bright);
          display: block;
        }

        .ab-hero-tagline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 3vw, 26px);
          color: var(--text-soft);
          font-style: italic;
          margin: 20px 0 36px;
          line-height: 1.5;
        }

        .ab-hero-tagline strong {
          font-style: normal;
          color: var(--text-primary);
          font-family: 'DM Serif Display', serif;
        }

        .ab-hero-cta-row {
          display: flex; gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ab-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 30px;
          background: var(--red);
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 10px; border: 1px solid rgba(255,100,100,0.25);
          cursor: pointer; text-decoration: none;
          transition: background 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          box-shadow: 0 4px 20px var(--red-glow);
          position: relative; overflow: hidden;
        }
        .ab-btn-primary::before {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease; transform: skewX(-15deg);
        }
        .ab-btn-primary:hover { background: var(--red-bright); transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px rgba(255,46,46,0.4); }
        .ab-btn-primary:hover::before { left: 140%; }

        .ab-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 30px;
          color: var(--text-soft);
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 10px; border: 1px solid var(--border-glass);
          cursor: pointer; text-decoration: none; background: transparent;
          transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ab-btn-ghost:hover { border-color: var(--border-red); color: var(--red-bright); background: var(--red-soft); transform: translateY(-2px); }

        /* ── STATS BAR ── */
        .ab-stats {
          position: relative;
          padding: 0 24px;
          margin: -30px auto 0;
          max-width: 960px;
          z-index: 2;
        }

        .ab-stats-inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--card-bg);
          border: 1px solid var(--border-glass);
          border-radius: 18px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .ab-stat-item {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid var(--border-hair);
          position: relative;
          transition: background 0.25s;
        }
        .ab-stat-item:last-child { border-right: none; }
        .ab-stat-item:hover { background: var(--red-soft); }

        .ab-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 4vw, 46px);
          color: var(--red-bright);
          letter-spacing: 0.04em;
          line-height: 1;
          display: block;
        }

        .ab-stat-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }

        /* ── SECTION WRAPPER ── */
        .ab-section { padding: 100px 24px; }
        .ab-section-inner { max-width: 1140px; margin: 0 auto; }

        /* ── SECTION LABEL ── */
        .ab-section-label {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--red-bright);
          margin-bottom: 16px;
        }
        .ab-section-label::before {
          content: ''; display: block;
          width: 24px; height: 2px;
          background: var(--red-bright); border-radius: 2px;
        }

        /* ── MISSION ── */
        .ab-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .ab-mission-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          letter-spacing: 0.03em;
          line-height: 1;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .ab-mission-headline span { color: var(--red-bright); }

        .ab-mission-body {
          font-size: 15.5px;
          line-height: 1.8;
          color: var(--text-soft);
          margin-bottom: 16px;
        }

        .ab-mission-body strong { color: var(--text-primary); font-weight: 600; }

        .ab-mission-visual {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          display: flex; align-items: center; justify-content: center;
        }

        .ab-mission-visual-inner {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 80% at 50% 50%, rgba(221,0,0,0.18) 0%, transparent 70%),
            var(--bg-surface);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 32px;
        }

        .ab-mission-logo-big {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px; letter-spacing: 0.06em;
          color: var(--text-primary); line-height: 1;
        }
        .ab-mission-logo-big span { color: var(--red-bright); }

        .ab-mission-badge {
          padding: 8px 20px;
          border-radius: 20px;
          border: 1px solid var(--border-red);
          background: var(--red-soft);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--red-bright);
        }

        .ab-mission-visual-lines {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(221,0,0,0.04) 40px, rgba(221,0,0,0.04) 41px);
        }

        /* ── VALUES ── */
        .ab-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .ab-value-card {
          padding: 32px 28px;
          background: var(--card-bg);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          transition: border-color 0.3s, background 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          backdrop-filter: blur(14px);
        }
        .ab-value-card:hover {
          border-color: var(--border-red);
          background: var(--card-hover);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.25), 0 0 0 1px var(--border-red);
        }

        .ab-value-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: var(--red-soft);
          border: 1px solid var(--border-red);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
          transition: background 0.3s, box-shadow 0.3s;
        }
        .ab-value-card:hover .ab-value-icon {
          background: rgba(221,0,0,0.18);
          box-shadow: 0 0 20px var(--red-glow);
        }
        .ab-value-icon svg { width: 22px; height: 22px; stroke: var(--red-bright); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

        .ab-value-title {
          font-family: 'Outfit', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .ab-value-desc { font-size: 14px; line-height: 1.7; color: var(--text-soft); }

        /* ── EXPERTS GRID ── */
        .ab-experts-heading {
          text-align: center; max-width: 600px; margin: 0 auto 60px;
        }
        .ab-experts-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 5vw, 60px);
          letter-spacing: 0.03em; line-height: 1;
          color: var(--text-primary); margin-bottom: 16px;
        }
        .ab-experts-title span { color: var(--red-bright); }
        .ab-experts-subtitle { font-size: 15px; color: var(--text-soft); line-height: 1.7; }

        .ab-experts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .ab-expert-card {
          padding: 28px 24px;
          background: var(--card-bg);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden;
          backdrop-filter: blur(14px);
        }

        .ab-expert-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--red), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ab-expert-card:hover {
          border-color: var(--border-red);
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.25), 0 0 30px var(--red-glow);
        }
        .ab-expert-card:hover::before { opacity: 1; }

        .ab-expert-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: var(--red-soft);
          border: 1px solid var(--border-red);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .ab-expert-icon svg { width: 24px; height: 24px; stroke: var(--red-bright); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

        .ab-expert-title {
          font-size: 16px; font-weight: 700;
          color: var(--text-primary); margin-bottom: 8px;
        }
        .ab-expert-desc { font-size: 13.5px; line-height: 1.65; color: var(--text-soft); margin-bottom: 16px; }

        .ab-expert-count {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          background: var(--red-soft);
          border: 1px solid var(--border-red);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--red-bright);
        }

        /* ── DIVIDER ── */
        .ab-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-glass), transparent);
          margin: 0;
        }

        /* ── CONTACT SECTION ── */
        .ab-contact-wrap {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 64px;
          align-items: start;
        }

        .ab-contact-info {}

        .ab-contact-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 5vw, 60px);
          letter-spacing: 0.03em; line-height: 1;
          color: var(--text-primary); margin-bottom: 20px;
        }
        .ab-contact-headline span { color: var(--red-bright); }

        .ab-contact-body {
          font-size: 15px; line-height: 1.8;
          color: var(--text-soft); margin-bottom: 36px;
        }

        .ab-contact-details { display: flex; flex-direction: column; gap: 16px; }

        .ab-contact-detail {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px;
          border-radius: 12px;
          border: 1px solid var(--border-glass);
          background: var(--card-bg);
          transition: border-color 0.25s, background 0.25s;
        }
        .ab-contact-detail:hover { border-color: var(--border-red); background: var(--red-soft); }
        .ab-contact-detail-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--red-soft); border: 1px solid var(--border-red);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ab-contact-detail-icon svg { width: 18px; height: 18px; stroke: var(--red-bright); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .ab-contact-detail-text { font-size: 14px; color: var(--text-soft); }
        .ab-contact-detail-text strong { display: block; font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: 0.05em; text-transform: uppercase; }

        /* ── FORM ── */
        .ab-form-card {
          background: var(--card-bg);
          border: 1px solid var(--border-glass);
          border-radius: 20px;
          padding: 40px 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          position: relative; overflow: hidden;
        }
        .ab-form-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--red-dim), var(--red-bright), var(--red-dim));
          opacity: 0.8;
        }

        .ab-form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 0.05em;
          color: var(--text-primary); margin-bottom: 6px;
        }
        .ab-form-subtitle {
          font-size: 13px; color: var(--text-muted); margin-bottom: 28px;
        }

        .ab-form { display: flex; flex-direction: column; gap: 18px; }

        .ab-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

        .ab-field { display: flex; flex-direction: column; gap: 7px; }
        .ab-field label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--text-muted);
        }

        .ab-input, .ab-select, .ab-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-glass);
          border-radius: 10px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          outline: none;
          width: 100%;
          -webkit-appearance: none;
        }
        .ab-input::placeholder, .ab-textarea::placeholder { color: var(--text-muted); }
        .ab-input:focus, .ab-select:focus, .ab-textarea:focus {
          border-color: var(--red);
          background: rgba(221,0,0,0.06);
          box-shadow: 0 0 0 3px var(--red-soft), 0 0 16px var(--red-glow);
        }
        .ab-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
          cursor: pointer;
        }
        .ab-select option { background: var(--bg-surface); color: var(--text-primary); }
        .ab-textarea { resize: vertical; min-height: 120px; }

        .ab-submit {
          display: flex; align-items: center; justify-content: center;
          gap: 10px;
          padding: 15px 30px;
          background: var(--red); color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          border: none; border-radius: 10px; cursor: pointer;
          transition: background 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          box-shadow: 0 4px 20px var(--red-glow);
          position: relative; overflow: hidden;
          width: 100%;
        }
        .ab-submit::before {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s; transform: skewX(-15deg);
        }
        .ab-submit:hover { background: var(--red-bright); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,46,46,0.4); }
        .ab-submit:hover::before { left: 140%; }
        .ab-submit:active { transform: translateY(0) scale(0.98); }
        .ab-submit svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

        /* success state */
        .ab-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 14px;
          padding: 32px; text-align: center;
          animation: fadeUp 0.4s ease;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .ab-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(34,197,94,0.12);
          border: 2px solid rgba(34,197,94,0.4);
          display: flex; align-items: center; justify-content: center;
        }
        .ab-success-icon svg { width: 28px; height: 28px; stroke: #22c55e; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .ab-success h3 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.05em; color: var(--text-primary); }
        .ab-success p { font-size: 14px; color: var(--text-soft); max-width: 260px; line-height: 1.6; }

        /* ── TRUST BAR ── */
        .ab-trust {
          padding: 60px 24px;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-hair);
          border-bottom: 1px solid var(--border-hair);
          text-align: center;
        }
        .ab-trust-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 24px;
        }
        .ab-trust-badges {
          display: flex; flex-wrap: wrap;
          gap: 12px; justify-content: center; align-items: center;
        }
        .ab-trust-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          border-radius: 24px;
          border: 1px solid var(--border-glass);
          background: var(--card-bg);
          font-size: 12px; font-weight: 600;
          color: var(--text-soft);
          transition: border-color 0.25s, color 0.25s;
        }
        .ab-trust-badge svg { width: 14px; height: 14px; stroke: var(--red-bright); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .ab-trust-badge:hover { border-color: var(--border-red); color: var(--text-primary); }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ab-mission-grid { grid-template-columns: 1fr; gap: 40px; }
          .ab-mission-visual { display: none; }
          .ab-experts-grid { grid-template-columns: repeat(2, 1fr); }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-contact-wrap { grid-template-columns: 1fr; gap: 40px; }
          .ab-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .ab-stat-item:nth-child(2) { border-right: none; }
          .ab-stat-item:nth-child(1),
          .ab-stat-item:nth-child(2) { border-bottom: 1px solid var(--border-hair); }
        }

        @media (max-width: 600px) {
          .ab-hero { padding: 60px 16px 80px; min-height: 80vh; }
          .ab-section { padding: 70px 16px; }
          .ab-form-card { padding: 28px 20px; }
          .ab-form-row { grid-template-columns: 1fr; }
          .ab-experts-grid { grid-template-columns: 1fr; }
          .ab-stats { margin: -20px 16px 0; padding: 0; }
          .ab-stats-inner { grid-template-columns: repeat(2,1fr); border-radius: 14px; }
        }
      `}</style>

      <div className="ab-page">

        {/* ══ HERO ══ */}
        <section className="ab-hero">
          <div className="ab-hero-bg" />
          <div className="ab-hero-content">
            <div ref={ref("eyebrow")} className={`reveal ${visible["eyebrow"] ? "visible" : ""}`}>
              <div className="ab-hero-eyebrow">
                <div className="ab-hero-eyebrow-dot" />
                India's Trusted News & Expert Network
              </div>
            </div>

            <div ref={ref("title")} className={`reveal ${visible["title"] ? "visible" : ""} delay-1`}>
              <h1 className="ab-hero-title">
                The Truth<br />
                <em>Delivered.</em>
              </h1>
            </div>

            <div ref={ref("tagline")} className={`reveal ${visible["tagline"] ? "visible" : ""} delay-2`}>
              <p className="ab-hero-tagline">
                <strong>GuptKhabre</strong> is more than a news platform —<br />
                it is where <strong>verified intelligence</strong> meets <strong>trusted expertise.</strong>
              </p>
            </div>

            <div ref={ref("ctas")} className={`reveal ${visible["ctas"] ? "visible" : ""} delay-3`}>
              <div className="ab-hero-cta-row">
                <Link href="#contact" className="ab-btn-primary">
                  Contact Us
                  <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:"#fff",fill:"none",strokeWidth:2.5,strokeLinecap:"round",strokeLinejoin:"round"}}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link href="/services" className="ab-btn-ghost">
                  Find Experts
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS BAR ══ */}
        <div className="ab-stats">
          <div ref={ref("stats")} className={`reveal ${visible["stats"] ? "visible" : ""}`}>
            <div className="ab-stats-inner">
              {stats.map((s, i) => (
                <div key={i} className="ab-stat-item">
                  <span className="ab-stat-value">{s.value}</span>
                  <span className="ab-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ MISSION ══ */}
        <section className="ab-section">
          <div className="ab-section-inner">
            <div
              ref={ref("mission")}
              className={`ab-mission-grid ${visible["mission"] ? "visible" : ""}`}
            >
              <div className={`reveal-left ${visible["mission"] ? "visible" : ""}`}>
                <div className="ab-section-label">Our Mission</div>
                <h2 className="ab-mission-headline">
                  News You Can<br />
                  <span>Actually Trust</span>
                </h2>
                <p className="ab-mission-body">
                  In an era of misinformation, <strong>GuptKhabre stands for integrity.</strong> We deliver
                  breaking news, investigative reports, and insider stories — all rigorously verified
                  before they reach you.
                </p>
                <p className="ab-mission-body">
                  But we are more than news. We connect you with a <strong>curated network of 200+ verified experts</strong> —
                  lawyers, doctors, financial advisors, and more — so you can act on information, not just read it.
                </p>
                <p className="ab-mission-body">
                  Founded in the heart of India, built for <strong>every citizen who deserves the truth.</strong>
                </p>
              </div>

              <div className={`reveal-right ${visible["mission"] ? "visible" : ""}`}>
                <div className="ab-mission-visual">
                  <div className="ab-mission-visual-lines" />
                  <div className="ab-mission-visual-inner">
                    <div className="ab-mission-logo-big">
                      Gupt<span>Khabre</span>
                    </div>
                    <div className="ab-mission-badge">Est. 2024 · Verified · Trusted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <div className="ab-divider" />
        <section className="ab-section" style={{background: "var(--bg-surface)"}}>
          <div className="ab-section-inner">
            <div ref={ref("values-label")} className={`reveal ${visible["values-label"] ? "visible" : ""}`} style={{textAlign:"center", marginBottom: 48}}>
              <div className="ab-section-label" style={{justifyContent:"center"}}><Link href="./admin/login">Why Choose Us</Link></div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,4.5vw,56px)", letterSpacing:"0.03em", color:"var(--text-primary)", lineHeight:1}}>
                Built on <span style={{color:"var(--red-bright)"}}>Three Pillars</span>
              </h2>
            </div>
            <div className="ab-values-grid">
              {values.map((v, i) => (
                <div
                  key={i}
                  ref={ref(`val-${i}`)}
                  className={`ab-value-card reveal delay-${i + 1} ${visible[`val-${i}`] ? "visible" : ""}`}
                >
                  <div className="ab-value-icon">
                    <svg viewBox="0 0 24 24"><path d={v.icon} /></svg>
                  </div>
                  <div className="ab-value-title">{v.title}</div>
                  <div className="ab-value-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ EXPERTS ══ */}
        <div className="ab-divider" />
        <section className="ab-section">
          <div className="ab-section-inner">
            <div ref={ref("exp-head")} className={`reveal ${visible["exp-head"] ? "visible" : ""}`}>
              <div className="ab-experts-heading">
                <div className="ab-section-label" style={{justifyContent:"center"}}>Expert Network</div>
                <h2 className="ab-experts-title">
                  200+ Verified<br /><span>Experts</span> At Your Service
                </h2>
                <p className="ab-experts-subtitle">
                  Don't just read the news — take action with India's most trusted professional network.
                  Every expert is background-checked and verified.
                </p>
              </div>
            </div>

            <div className="ab-experts-grid">
              {experts.map((ex, i) => (
                <div
                  key={i}
                  ref={ref(`exp-${i}`)}
                  className={`ab-expert-card reveal delay-${(i % 3) + 1} ${visible[`exp-${i}`] ? "visible" : ""}`}
                >
                  <div className="ab-expert-icon">
                    <svg viewBox="0 0 24 24"><path d={ex.icon} /></svg>
                  </div>
                  <div className="ab-expert-title">{ex.title}</div>
                  <div className="ab-expert-desc">{ex.desc}</div>
                  <div className="ab-expert-count">
                    <svg viewBox="0 0 24 24" style={{width:10,height:10}}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {ex.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TRUST BAR ══ */}
        <div className="ab-trust">
          <div className="ab-trust-label">Trusted & Recognized By</div>
          <div className="ab-trust-badges">
            {["Press Council of India", "ISO Certified", "SSL Secured", "GDPR Compliant", "No Paid News", "Fact-Checked Content"].map((b, i) => (
              <div key={i} className="ab-trust-badge">
                <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* ══ CONTACT ══ */}
        <section className="ab-section" id="contact">
          <div className="ab-section-inner">
            <div className="ab-contact-wrap">

              {/* Info Side */}
              <div ref={ref("contact-info")} className={`reveal-left ${visible["contact-info"] ? "visible" : ""}`}>
                <div className="ab-section-label">Get In Touch</div>
                <h2 className="ab-contact-headline">
                  Let's <span>Connect</span><br />& Collaborate
                </h2>
                <p className="ab-contact-body">
                  Whether you have a news tip, need an expert consultation, or want to partner with us —
                  our team responds within 24 hours. Your privacy is guaranteed.
                </p>

                <div className="ab-contact-details">
                  {[
                    
                    {
                      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                      label: "Location",
                      value: "New Delhi, India",
                    },
                    {
                      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                      label: "Privacy",
                      value: "100% Confidential — Always",
                    },
                  ].map((d, i) => (
                    <div key={i} className="ab-contact-detail">
                      <div className="ab-contact-detail-icon">
                        <svg viewBox="0 0 24 24"><path d={d.icon}/></svg>
                      </div>
                      <div className="ab-contact-detail-text">
                        <strong>{d.label}</strong>
                        {d.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Side */}
              <div ref={ref("contact-form")} className={`reveal-right ${visible["contact-form"] ? "visible" : ""}`}>
                <div className="ab-form-card">
                  {submitted ? (
                    <div className="ab-success">
                      <div className="ab-success-icon">
                        <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <h3>Message Sent!</h3>
                      <p>We'll get back to you within 24 hours. Your privacy is protected.</p>
                    </div>
                  ) : (
                    <>
                      <div className="ab-form-title">Send Us a Message</div>
                      <div className="ab-form-subtitle">All fields required · 100% private & secure</div>

                      <form className="ab-form" onSubmit={handleSubmit}>
                        <div className="ab-form-row">
                          <div className="ab-field">
                            <label>Your Name</label>
                            <input
                              className="ab-input"
                              type="text"
                              placeholder="Yogesh Baghel"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="ab-field">
                            <label>Contact Number</label>
                            <input
                              className="ab-input"
                              type="tel"
                              placeholder="+91 8120172278"
                              value={formData.contact}
                              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="ab-field">
                          <label>Purpose</label>
                          <select
                            className="ab-select"
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            required
                          >
                            <option value="" disabled>Select purpose...</option>
                            {purposes.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        <div className="ab-field">
                          <label>Your Message</label>
                          <textarea
                            className="ab-textarea"
                            placeholder="Tell us how we can help you..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                          />
                        </div>

                        <button type="submit" className="ab-submit">
                          Send Message
                          <svg viewBox="0 0 24 24">
                            <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
                          </svg>
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom spacer for mobile nav ── */}
        <div style={{height: 80}} />
      </div>
    </>
  );
}