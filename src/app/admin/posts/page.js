"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { getAdminPosts, deletePost } from "@/module/posts/postService";

// ── Icons ────────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const DeleteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);
const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatLikes(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

const POSTS_PER_PAGE = 10;

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllPosts() {
  const router = useRouter();
  const { theme } = useTheme();

  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminPosts({ page, limit: POSTS_PER_PAGE, search });
      setPosts(data.posts);
      setTotal(data.total);
    } catch (err) {
      showToast(err.message || "Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Search debounce ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePost(deleteTarget._id);
      showToast("Post deleted successfully");
      // If we deleted the last item on a page > 1, go back one page
      if (posts.length === 1 && page > 1) setPage(page - 1);
      else setPosts(prev => prev.filter(p => p._id !== deleteTarget._id));
setTotal(prev => prev - 1);
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  // ── Pagination pages array ─────────────────────────────────────────────────
  function getPageNums() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Figtree:wght@300;400;500;600&display=swap');

        .ap-root {
          font-family: 'Figtree', sans-serif;
          --ap-accent: #7c3aed;
          --ap-accent-light: #a78bfa;
          --ap-teal: #06b6d4;
          --ap-red: #f87171;
          --ap-red-bg: rgba(248,113,113,0.1);
          --ap-red-border: rgba(248,113,113,0.2);
          --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Dark ── */
        [data-theme="dark"] .ap-root {
          --ap-bg: #0d0d0f;
          --ap-card: rgba(255,255,255,0.025);
          --ap-card-border: rgba(255,255,255,0.07);
          --ap-row-hover: rgba(255,255,255,0.04);
          --ap-row-border: rgba(255,255,255,0.05);
          --ap-text: #f1f1f3;
          --ap-muted: #6b7280;
          --ap-label: #4b5563;
          --ap-input-bg: rgba(255,255,255,0.05);
          --ap-input-border: rgba(255,255,255,0.08);
          --ap-input-focus: rgba(124,58,237,0.5);
          --ap-btn-bg: rgba(255,255,255,0.05);
          --ap-btn-border: rgba(255,255,255,0.08);
          --ap-page-btn: rgba(255,255,255,0.04);
          --ap-page-border: rgba(255,255,255,0.07);
          --ap-skeleton: rgba(255,255,255,0.06);
          --ap-skeleton-shine: rgba(255,255,255,0.04);
        }

        /* ── Light ── */
        [data-theme="light"] .ap-root {
          --ap-bg: #f5f5f7;
          --ap-card: rgba(255,255,255,0.9);
          --ap-card-border: rgba(0,0,0,0.07);
          --ap-row-hover: rgba(124,58,237,0.03);
          --ap-row-border: rgba(0,0,0,0.05);
          --ap-text: #111118;
          --ap-muted: #6b7280;
          --ap-label: #9ca3af;
          --ap-input-bg: rgba(0,0,0,0.04);
          --ap-input-border: rgba(0,0,0,0.08);
          --ap-input-focus: rgba(124,58,237,0.35);
          --ap-btn-bg: rgba(0,0,0,0.04);
          --ap-btn-border: rgba(0,0,0,0.08);
          --ap-page-btn: rgba(0,0,0,0.04);
          --ap-page-border: rgba(0,0,0,0.07);
          --ap-skeleton: rgba(0,0,0,0.06);
          --ap-skeleton-shine: rgba(0,0,0,0.03);
        }

        /* ── Page header ── */
        .ap-header {
          margin-bottom: 24px;
        }
        .ap-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(22px, 5vw, 32px);
          font-weight: 800;
          color: var(--ap-text);
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .ap-title span { color: var(--ap-accent-light); }
        .ap-subtitle {
          font-size: 13px;
          color: var(--ap-muted);
          margin-top: 4px;
        }
        .ap-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ap-new-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 16px;
          background: var(--ap-accent);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Figtree', sans-serif;
          cursor: pointer;
          transition: opacity var(--transition), transform var(--transition);
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(124,58,237,0.3);
        }
        .ap-new-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Toolbar ── */
        .ap-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .ap-search-wrap {
          position: relative;
          flex: 1;
          min-width: 180px;
          max-width: 340px;
        }
        .ap-search-icon {
          position: absolute;
          left: 11px; top: 50%;
          transform: translateY(-50%);
          color: var(--ap-muted);
          pointer-events: none;
        }
        .ap-search {
          width: 100%;
          height: 38px;
          background: var(--ap-input-bg);
          border: 1px solid var(--ap-input-border);
          border-radius: 10px;
          padding: 0 12px 0 36px;
          font-size: 13px;
          font-family: 'Figtree', sans-serif;
          color: var(--ap-text);
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
        }
        .ap-search::placeholder { color: var(--ap-label); }
        .ap-search:focus {
          border-color: var(--ap-input-focus);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }
        .ap-count {
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ap-label);
          white-space: nowrap;
        }
        .ap-count strong { color: var(--ap-muted); font-weight: 600; }

        /* ── Table card ── */
        .ap-card {
          background: var(--ap-card);
          border: 1px solid var(--ap-card-border);
          border-radius: 16px;
          overflow: hidden;
          transition: background var(--transition);
        }

        /* ── Desktop table ── */
        .ap-table { width: 100%; border-collapse: collapse; }
        .ap-thead th {
          text-align: left;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ap-label);
          font-weight: 600;
          padding: 14px 16px;
          border-bottom: 1px solid var(--ap-row-border);
          white-space: nowrap;
        }
        .ap-thead th:first-child { padding-left: 20px; }
        .ap-thead th:last-child { text-align: right; padding-right: 20px; }

        .ap-row {
          border-bottom: 1px solid var(--ap-row-border);
          transition: background var(--transition);
          animation: rowIn 0.3s ease both;
        }
        .ap-row:last-child { border-bottom: none; }
        .ap-row:hover { background: var(--ap-row-hover); }

        @keyframes rowIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ap-row td {
          padding: 14px 16px;
          vertical-align: middle;
        }
        .ap-row td:first-child { padding-left: 20px; }
        .ap-row td:last-child { padding-right: 20px; }

        /* S.No */
        .ap-sno {
          font-size: 12px;
          color: var(--ap-label);
          font-weight: 500;
          width: 40px;
        }

        /* Post cell */
        .ap-post-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .ap-thumb-wrap {
          position: relative;
          width: 52px; height: 52px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(255,255,255,0.05);
        }
        .ap-thumb {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .ap-thumb-badge {
          position: absolute;
          bottom: 3px; right: 3px;
          background: rgba(0,0,0,0.7);
          border-radius: 4px;
          padding: 2px 4px;
          color: #fff;
          display: flex; align-items: center;
        }
        .ap-post-info { min-width: 0; }
        .ap-post-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ap-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 280px;
          line-height: 1.3;
        }
        .ap-post-meta {
          font-size: 11.5px;
          color: var(--ap-muted);
          margin-top: 2px;
        }

        /* Date */
        .ap-date {
          font-size: 12.5px;
          color: var(--ap-muted);
          white-space: nowrap;
        }

        /* Likes */
        .ap-likes {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          color: #f472b6;
          white-space: nowrap;
        }

        /* Actions */
        .ap-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: flex-end;
        }
        .ap-btn-edit, .ap-btn-del {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all var(--transition);
        }
        .ap-btn-edit {
          background: var(--ap-btn-bg);
          border-color: var(--ap-btn-border);
          color: var(--ap-muted);
        }
        .ap-btn-edit:hover {
          background: rgba(124,58,237,0.12);
          border-color: rgba(124,58,237,0.3);
          color: var(--ap-accent-light);
        }
        .ap-btn-del {
          background: var(--ap-red-bg);
          border-color: var(--ap-red-border);
          color: var(--ap-red);
        }
        .ap-btn-del:hover {
          background: rgba(248,113,113,0.2);
          transform: scale(1.05);
        }

        /* ── Mobile cards ── */
        .ap-mobile-list { display: none; }
        .ap-mobile-card {
          padding: 14px 16px;
          border-bottom: 1px solid var(--ap-row-border);
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: rowIn 0.3s ease both;
          transition: background var(--transition);
        }
        .ap-mobile-card:last-child { border-bottom: none; }
        .ap-mobile-card:active { background: var(--ap-row-hover); }
        .ap-mobile-thumb {
          width: 58px; height: 58px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          background: rgba(255,255,255,0.05);
        }
        .ap-mobile-body { flex: 1; min-width: 0; }
        .ap-mobile-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ap-text);
          line-height: 1.35;
          margin-bottom: 4px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .ap-mobile-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 8px;
        }
        .ap-mobile-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--ap-muted);
        }
        .ap-mobile-actions {
          display: flex;
          gap: 6px;
        }
        .ap-mobile-sno {
          font-size: 10px;
          color: var(--ap-label);
          background: var(--ap-btn-bg);
          border: 1px solid var(--ap-btn-border);
          border-radius: 5px;
          padding: 1px 6px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* ── Skeleton loader ── */
        .ap-skeleton-row td { padding: 14px 16px; }
        .ap-skeleton-row td:first-child { padding-left: 20px; }
        .ap-skel {
          background: var(--ap-skeleton);
          border-radius: 6px;
          animation: shimmer 1.5s ease-in-out infinite alternate;
        }
        @keyframes shimmer {
          from { opacity: 1; }
          to   { opacity: 0.4; }
        }
        .ap-skel-thumb { width: 52px; height: 52px; border-radius: 10px; }
        .ap-skel-line { height: 12px; }
        .ap-skel-sm { height: 10px; width: 60%; margin-top: 6px; }

        /* ── Empty state ── */
        .ap-empty {
          text-align: center;
          padding: 60px 20px;
        }
        .ap-empty-icon {
          width: 52px; height: 52px;
          background: var(--ap-btn-bg);
          border: 1px solid var(--ap-btn-border);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          color: var(--ap-label);
        }
        .ap-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--ap-text);
          margin-bottom: 6px;
        }
        .ap-empty-sub { font-size: 13px; color: var(--ap-muted); }

        /* ── Pagination ── */
        .ap-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid var(--ap-row-border);
          flex-wrap: wrap;
          gap: 10px;
        }
        .ap-pag-info {
          font-size: 12px;
          color: var(--ap-muted);
        }
        .ap-pag-info strong { color: var(--ap-text); }
        .ap-pag-btns {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ap-pag-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid var(--ap-page-border);
          background: var(--ap-page-btn);
          color: var(--ap-muted);
          font-size: 13px;
          font-weight: 500;
          font-family: 'Figtree', sans-serif;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all var(--transition);
        }
        .ap-pag-btn:hover:not(:disabled) {
          background: rgba(124,58,237,0.12);
          border-color: rgba(124,58,237,0.3);
          color: var(--ap-accent-light);
        }
        .ap-pag-btn.active {
          background: var(--ap-accent);
          border-color: var(--ap-accent);
          color: #fff;
          box-shadow: 0 0 12px rgba(124,58,237,0.4);
        }
        .ap-pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .ap-pag-dots {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          color: var(--ap-label);
        }

        /* ── Delete modal ── */
        .ap-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          z-index: 500;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .ap-modal {
          background: var(--ap-card);
          border: 1px solid var(--ap-card-border);
          border-radius: 18px;
          padding: 24px;
          width: 100%; max-width: 360px;
          animation: modalIn 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes modalIn {
          from { transform: scale(0.94) translateY(12px); opacity: 0 }
          to   { transform: scale(1) translateY(0); opacity: 1 }
        }
        .ap-modal-icon {
          width: 46px; height: 46px;
          background: var(--ap-red-bg);
          border: 1px solid var(--ap-red-border);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--ap-red);
          margin-bottom: 14px;
        }
        .ap-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--ap-text);
          margin-bottom: 6px;
        }
        .ap-modal-sub {
          font-size: 13px; color: var(--ap-muted);
          line-height: 1.5; margin-bottom: 6px;
        }
        .ap-modal-post-name {
          font-size: 13px; font-weight: 600;
          color: var(--ap-text);
          background: var(--ap-btn-bg);
          border: 1px solid var(--ap-btn-border);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ap-modal-actions { display: flex; gap: 8px; }
        .ap-modal-cancel {
          flex: 1; height: 40px;
          background: var(--ap-btn-bg);
          border: 1px solid var(--ap-btn-border);
          border-radius: 10px;
          color: var(--ap-text);
          font-size: 13.5px; font-weight: 500;
          font-family: 'Figtree', sans-serif;
          cursor: pointer;
          transition: opacity var(--transition);
        }
        .ap-modal-cancel:hover { opacity: 0.75; }
        .ap-modal-delete {
          flex: 1; height: 40px;
          background: #dc2626;
          border: none; border-radius: 10px;
          color: #fff;
          font-size: 13.5px; font-weight: 600;
          font-family: 'Figtree', sans-serif;
          cursor: pointer;
          transition: background var(--transition);
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .ap-modal-delete:hover { background: #b91c1c; }
        .ap-modal-delete:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Toast ── */
        .ap-toast {
          position: fixed;
          bottom: 80px; left: 50%;
          transform: translateX(-50%);
          z-index: 600;
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 500;
          color: #f1f1f3;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: toastIn 0.25s cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
        }
        .ap-toast.error { border-color: rgba(248,113,113,0.3); }
        .ap-toast .toast-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .ap-toast .toast-dot.success { background: #34d399; }
        .ap-toast .toast-dot.error   { background: var(--ap-red); }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .ap-desktop-table { display: none; }
          .ap-mobile-list { display: block; }
          .ap-pag-info { display: none; }
        }
        @media (min-width: 641px) {
          .ap-mobile-list { display: none; }
          .ap-desktop-table { display: block; }
        }
      `}</style>

      <div className="ap-root" data-theme-ref>

        {/* ── Header ── */}
        <div className="ap-header">
          <div className="ap-header-row">
            <div>
              <h1 className="ap-title">All <span>Posts</span></h1>
              <p className="ap-subtitle">Manage and curate your publication's content</p>
            </div>
         
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="ap-toolbar">
          <div className="ap-search-wrap">
            <span className="ap-search-icon"><SearchIcon /></span>
            <input
              className="ap-search"
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="ap-count">
            Showing <strong>{posts.length}</strong> of <strong>{total}</strong> posts
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="ap-card">

          {/* ─── DESKTOP TABLE ─── */}
          <div className="ap-desktop-table">
            <table className="ap-table">
              <thead className="ap-thead">
                <tr>
                  <th>#</th>
                  <th>Article</th>
                  <th>Media</th>
                  <th>Likes</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="ap-skeleton-row ap-row">
                      <td><div className="ap-skel ap-skel-line" style={{ width: 20 }} /></td>
                      <td>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div className="ap-skel ap-skel-thumb" />
                          <div>
                            <div className="ap-skel ap-skel-line" style={{ width: 200 }} />
                            <div className="ap-skel ap-skel-sm" />
                          </div>
                        </div>
                      </td>
                      <td><div className="ap-skel ap-skel-line" style={{ width: 50 }} /></td>
                      <td><div className="ap-skel ap-skel-line" style={{ width: 40 }} /></td>
                      <td><div className="ap-skel ap-skel-line" style={{ width: 130 }} /></td>
                      <td><div className="ap-skel ap-skel-line" style={{ width: 60, marginLeft: "auto" }} /></td>
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState search={search} />
                    </td>
                  </tr>
                ) : (
                  posts.map((post, i) => (
                    <tr
                      key={post._id}
                      className="ap-row"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <td className="ap-sno">{(page - 1) * POSTS_PER_PAGE + i + 1}</td>

                      {/* Post cell */}
                      <td>
                        <div className="ap-post-cell">
                          <div className="ap-thumb-wrap">
                            {post.mediaType === "image" ? (
                              <img src={post.mediaUrl} alt={post.title} className="ap-thumb" />
                            ) : (
                              <video src={post.mediaUrl} className="ap-thumb" muted playsInline />
                            )}
                            {post.mediaType === "video" && (
                              <span className="ap-thumb-badge"><VideoIcon /></span>
                            )}
                          </div>
                          <div className="ap-post-info">
                            <div className="ap-post-title">{post.title}</div>
                            <div className="ap-post-meta">
                              {post.createdBy?.name || post.createdBy?.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Media type */}
                      <td>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          padding: "3px 8px", borderRadius: 6,
                          background: post.mediaType === "video"
                            ? "rgba(6,182,212,0.1)" : "rgba(167,139,250,0.1)",
                          color: post.mediaType === "video"
                            ? "var(--ap-teal)" : "var(--ap-accent-light)",
                          border: `1px solid ${post.mediaType === "video"
                            ? "rgba(6,182,212,0.2)" : "rgba(167,139,250,0.2)"}`,
                        }}>
                          {post.mediaType === "video" ? <VideoIcon /> : <ImageIcon />}
                          {post.mediaType}
                        </span>
                      </td>

                      {/* Likes */}
                      <td>
                        <span className="ap-likes">
                          <HeartIcon /> {formatLikes(post.likes)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="ap-date">{formatDate(post.createdAt)}</td>

                      {/* Actions */}
                      <td>
                        <div className="ap-actions">
                          {/* <button
                            className="ap-btn-edit"
                            onClick={() => router.push(`/admin/posts/${post._id}/edit`)}
                            title="Edit"
                          >
                            <EditIcon />
                          </button> */}
                          <button
                            className="ap-btn-del"
                            onClick={() => setDeleteTarget(post)}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ─── MOBILE CARDS ─── */}
          <div className="ap-mobile-list">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="ap-mobile-card">
                  <div className="ap-skel ap-mobile-thumb" style={{ borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div className="ap-skel ap-skel-line" style={{ width: "85%", marginBottom: 8 }} />
                    <div className="ap-skel ap-skel-line" style={{ width: "50%" }} />
                  </div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <EmptyState search={search} />
            ) : (
              posts.map((post, i) => (
                <div
                  key={post._id}
                  className="ap-mobile-card"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="ap-mobile-thumb">
                    {post.mediaType === "image" ? (
                      <img src={post.mediaUrl} alt={post.title} className="ap-thumb" />
                    ) : (
                      <video src={post.mediaUrl} className="ap-thumb" muted playsInline />
                    )}
                    {post.mediaType === "video" && (
                      <span className="ap-thumb-badge"><VideoIcon /></span>
                    )}
                  </div>
                  <div className="ap-mobile-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span className="ap-mobile-sno">#{(page - 1) * POSTS_PER_PAGE + i + 1}</span>
                    </div>
                    <div className="ap-mobile-title">{post.title}</div>
                    <div className="ap-mobile-meta">
                      <span className="ap-mobile-meta-item">
                        <HeartIcon /> {formatLikes(post.likes)}
                      </span>
                      <span className="ap-mobile-meta-item">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="ap-mobile-actions">
                      <button
                        className="ap-btn-edit"
                        onClick={() => router.push(`/admin/posts/${post._id}/edit`)}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="ap-btn-del"
                        onClick={() => setDeleteTarget(post)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ─── Pagination ─── */}
          {!loading && posts.length > 0 && (
            <div className="ap-pagination">
              <div className="ap-pag-info">
                Showing <strong>{(page - 1) * POSTS_PER_PAGE + 1}</strong>–
                <strong>{Math.min(page * POSTS_PER_PAGE, total)}</strong> of{" "}
                <strong>{total}</strong> posts
              </div>
              <div className="ap-pag-btns">
                <button
                  className="ap-pag-btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft />
                </button>

                {getPageNums().map((p, idx) =>
                  p === "..." ? (
                    <span key={`dot-${idx}`} className="ap-pag-dots">…</span>
                  ) : (
                    <button
                      key={p}
                      className={`ap-pag-btn${page === p ? " active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  className="ap-pag-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Delete confirm modal ── */}
        {deleteTarget && (
          <div className="ap-modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ap-modal-icon"><DeleteIcon /></div>
              <div className="ap-modal-title">Delete Post?</div>
              <div className="ap-modal-sub">This action cannot be undone. The post will be permanently removed.</div>
              <div className="ap-modal-post-name">{deleteTarget.title}</div>
              <div className="ap-modal-actions">
                <button className="ap-modal-cancel" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button
                  className="ap-modal-delete"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : <DeleteIcon />}
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        {toast && (
          <div className={`ap-toast ${toast.type}`}>
            <span className={`toast-dot ${toast.type}`} />
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ search }) {
  return (
    <div className="ap-empty">
      <div className="ap-empty-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>
      <div className="ap-empty-title">{search ? "No results found" : "No posts yet"}</div>
      <div className="ap-empty-sub">
        {search ? `No posts match "${search}"` : "Create your first post to get started"}
      </div>
    </div>
  );
}