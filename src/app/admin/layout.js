"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

function AdminLayoutInner({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, pathname]);

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');
          .gk-loader {
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            font-family: 'Syne', sans-serif;
          }
          [data-theme="dark"] .gk-loader { background: #0d0d0f; color: #f1f1f3; }
          [data-theme="light"] .gk-loader { background: #f5f5f7; color: #111118; }
          .gk-spinner {
            width: 36px; height: 36px;
            border: 3px solid rgba(124,58,237,0.2);
            border-top-color: #7c3aed;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .gk-loader-text { font-size: 13px; letter-spacing: 0.05em; opacity: 0.5; }
        `}</style>
        <div data-theme={theme}>
          <div className="gk-loader">
            <div className="gk-spinner" />
            <span className="gk-loader-text">Loading console…</span>
          </div>
        </div>
      </>
    );
  }

  if (isLoginPage) return children;
  if (!isAuthenticated) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Theme tokens ── */
        [data-theme="dark"] .admin-layout {
          --layout-bg: #0d0d0f;
          --layout-main-bg: #0d0d0f;
          --layout-text: #f1f1f3;
          --layout-muted: #6b7280;
          --layout-border: rgba(255,255,255,0.06);
          --layout-card-bg: rgba(255,255,255,0.03);
          --scrollbar-thumb: rgba(255,255,255,0.1);
        }
        [data-theme="light"] .admin-layout {
          --layout-bg: #f5f5f7;
          --layout-main-bg: #f0f0f4;
          --layout-text: #111118;
          --layout-muted: #9ca3af;
          --layout-border: rgba(0,0,0,0.07);
          --layout-card-bg: rgba(255,255,255,0.7);
          --scrollbar-thumb: rgba(0,0,0,0.1);
        }

        .admin-layout {
          min-height: 100dvh;
          background: var(--layout-bg);
          color: var(--layout-text);
          font-family: 'DM Sans', sans-serif;
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* Desktop: offset content for sidebar */
        .admin-content-wrap {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        /* Main content area */
        .admin-main {
          flex: 1;
          padding: 20px 16px 88px; /* extra bottom for mobile bar */
          background: var(--layout-main-bg);
          transition: background 0.3s ease;
          overflow-x: hidden;
        }

        /* Custom scrollbar */
        .admin-main::-webkit-scrollbar { width: 4px; }
        .admin-main::-webkit-scrollbar-track { background: transparent; }
        .admin-main::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 2px;
        }

        /* Page entry animation */
        .admin-main > * {
          animation: pageIn 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Desktop adjustments */
        @media (min-width: 769px) {
          .admin-content-wrap {
            margin-left: 240px; /* matches sidebar width */
          }
          .admin-content-wrap.sidebar-collapsed {
            margin-left: 72px;
          }
          .admin-main {
            padding: 24px 28px 24px;
          }
        }

        /* Tablet */
        @media (min-width: 480px) and (max-width: 768px) {
          .admin-main { padding: 20px 20px 88px; }
        }
      `}</style>

      <div data-theme={theme} className="admin-layout">
        <Sidebar />

        <div className="admin-content-wrap" id="admin-content">
          <Topbar />
          <main className="admin-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ThemeProvider>
  );
}