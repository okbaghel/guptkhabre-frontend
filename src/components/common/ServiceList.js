"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import Link from 'next/link';

const PAGE_SIZE = 12;

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
  const [profile, setProfile] = useState("all");
  const [sortBy, setSortBy]   = useState("newest");
  const [page, setPage]       = useState(1);
  const loaderRef = useRef(null);

  const debouncedSearch = useDebounce(search);

  const safeServices = useMemo(() =>
    Array.isArray(services) ? services : services?.services || services?.data || [],
    [services]
  );

  const profiles = useMemo(() => [
    "all",
    ...new Set(safeServices.map((s) => s.profile).filter(Boolean)),
  ], [safeServices]);

  useEffect(() => { setPage(1); }, [debouncedSearch, profile, sortBy]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    let out = safeServices.filter((s) => {
      if (profile !== "all" && s.profile !== profile) return false;
      if (!q) return true;
      return (
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.profile?.toLowerCase().includes(q) ||
        s.mobile?.includes(q)
      );
    });
    if (sortBy === "newest") out = [...out].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") out = [...out].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "name") out = [...out].sort((a, b) => a.name?.localeCompare(b.name));
    else if (sortBy === "active") out = [...out].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
    return out;
  }, [debouncedSearch, profile, sortBy, safeServices]);

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  // Auto load-more via IntersectionObserver
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
    setSearch(""); setProfile("all"); setSortBy("newest");
  }, []);

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen w-full" style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* ── Hero Section (ProNexus pattern) ── */}
      <section className="relative h-[500px] md:h-[560px] flex items-center overflow-hidden px-8 pt-20">
        {/* Overlay gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#0e0e0e]/60 to-[#0e0e0e]" />

        {/* Ambient glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#b6a0ff]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00e3fd]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="max-w-3xl">
            <p className="text-[#00e3fd] text-xs font-semibold tracking-[0.3em] uppercase mb-5">
              Professional Directory
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-5 leading-[1.05]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Find the Right{" "}
              <span className="bg-gradient-to-br from-[#b6a0ff] to-[#00e3fd] bg-clip-text text-transparent">
                Professional
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#adaaaa] max-w-2xl leading-relaxed">
              Connect with verified specialists across every domain — from digital craft to on-ground expertise.
            </p>

            {/* Stat badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131313] border border-[#262626] text-sm text-[#adaaaa]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">{safeServices.length.toLocaleString()}</span> services listed
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131313] border border-[#262626] text-sm text-[#adaaaa]">
                <span className="text-[#b6a0ff] font-semibold">{profiles.length - 1}</span> categories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter & Search Bar (ProNexus filter section) ── */}
      <section className="max-w-[1440px] mx-auto px-8 -mt-10 relative z-20">
        <div className="bg-[#131313] rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-[0_0_50px_-12px_rgba(182,160,255,0.12)]">

          {/* Profile chips — horizontally scrollable on mobile */}
          <div className="flex gap-2 flex-nowrap overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {profiles.map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors capitalize ${
                  profile === p
                    ? "bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-[#1c0060]"
                    : "bg-[#262626] text-white hover:bg-[#2c2c2c]"
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>

          {/* Right side: search + sort */}
          <div className="flex gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-72">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none"
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="w-full bg-[#262626] border-none rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#b6a0ff]/25"
                placeholder="Search professionals…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              />
            </div>

            {/* Sort */}
            <select
              className="bg-[#262626] text-[#adaaaa] text-sm rounded-xl px-3 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-[#b6a0ff]/25 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">A to Z</option>
              <option value="active">Active</option>
            </select>

            {/* Clear */}
            {(search || profile !== "all" || sortBy !== "newest") && (
              <button
                onClick={handleClear}
                className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-colors border border-red-500/20"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {(debouncedSearch || profile !== "all") && (
          <p className="text-[#555] text-xs tracking-wide mt-4 px-1">
            Showing{" "}
            <span className="text-[#adaaaa] font-semibold">{filtered.length}</span>{" "}
            result{filtered.length !== 1 ? "s" : ""}
            {debouncedSearch && (
              <> for "<span className="text-[#b6a0ff]">{debouncedSearch}</span>"</>
            )}
            {profile !== "all" && (
              <> in <span className="text-[#00e3fd]">{profile}</span></>
            )}
          </p>
        )}
      </section>

      {/* ── Professional Grid ── */}
      <section className="max-w-[1440px] mx-auto px-8 py-16 pb-28 md:pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p
              className="text-4xl font-bold text-[#262626] mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              No results
            </p>
            <p className="text-[#404040] text-sm">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-12">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#b6a0ff] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!hasMore && visible.length > PAGE_SIZE && (
              <p className="text-center text-[#333] text-xs tracking-widest uppercase py-10">
                — All {filtered.length} professionals loaded —
              </p>
            )}
          </>
        )}
      </section>

      {/* ── Join CTA Section (ProNexus pattern) ── */}
      <section className="max-w-[1440px] mx-auto px-8 mb-20">
        <div className="relative rounded-xl overflow-hidden p-12 md:p-20 text-center bg-[#131313]">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#b6a0ff]/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2
              className="text-4xl md:text-5xl font-bold mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Are you a{" "}
              <span className="bg-gradient-to-br from-[#b6a0ff] to-[#00e3fd] bg-clip-text text-transparent">
                Professional?
              </span>
            </h2>
            <p className="text-lg text-[#adaaaa] mb-10 leading-relaxed">
              Join our verified directory and get discovered by clients looking for the best.
            </p>
          <Link href="/about">
  <button
    className="px-10 py-4 bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-[#1c0060] rounded-xl font-bold text-base active:scale-95 transition-transform shadow-[0_0_50px_-12px_rgba(182,160,255,0.4)]"
    style={{ fontFamily: "'Manrope', sans-serif" }}
  >
    Join the Directory
  </button>
</Link>
          </div>
        </div>
      </section>

    </div>
  );
}