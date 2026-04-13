"use client";

import Image from "next/image";

export default function ServiceCard({ service }) {
  const isActive = service.isActive !== false;

  const formattedDate = service.createdAt
    ? new Date(service.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="bg-[#131313] rounded-2xl overflow-hidden group hover:bg-[#1a1919] transition-all duration-500"
      style={{
        boxShadow: "0 0 50px -12px rgba(182,160,255,0.08)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 0 50px -12px rgba(182,160,255,0.22)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 0 50px -12px rgba(182,160,255,0.08)")
      }
    >
      <div className="p-8">

        {/* ── Row 1: Avatar + Name + Role ── */}
        <div className="flex items-center gap-5 mb-7">

          {/* Avatar with ambient glow (ProNexus pattern) */}
          <div className="relative flex-shrink-0">
            {/* Glow layer behind avatar */}
            <div className="absolute inset-0 rounded-full bg-[#00e3fd] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Avatar image */}
            <div className="relative z-10 w-[88px] h-[88px] rounded-full overflow-hidden border-2 border-[#262626]">
              <Image
                src={service.imageUrl || "/logo.png"}
                alt={service.name}
                fill
                className="object-cover"
                sizes="88px"
              />
            </div>

            {/* Instagram-style verified badge */}
            <div
              className="absolute bottom-0 right-0 z-20 w-[22px] h-[22px] rounded-full bg-[#3b82f6] border-[2.5px] border-[#131313] flex items-center justify-center"
              title="Verified"
            >
              <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Name + Role */}
          <div className="min-w-0 flex-1">
            <h3
              className="text-[22px] font-bold text-white leading-tight truncate"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {service.name}
            </h3>
            <p
              className="text-[#00e3fd] font-semibold tracking-[0.14em] text-[11px] uppercase mt-1 truncate"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {service.profile}
            </p>

            {/* Date */}
            {formattedDate && (
              <p
                className="text-[#404040] text-[10.5px] mt-1"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Since {formattedDate}
              </p>
            )}
          </div>

          {/* Live / Off pill */}
          {isActive ? (
            <span
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9.5px] font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          ) : (
            <span
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/40 text-zinc-500 text-[9.5px] font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              Off
            </span>
          )}
        </div>

        {/* ── Row 2: Description ── */}
        <p
          className="text-[#adaaaa] text-sm leading-relaxed mb-8"
          style={{
            fontFamily: "'Manrope', sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {service.description}
        </p>

        {/* ── Row 3: Two pill buttons (ProNexus exact pattern) ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Call — dark pill */}
          <a
            href={`tel:${service.mobile}`}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#262626] hover:bg-[#2c2c2c] text-white rounded-full font-bold text-sm transition-colors"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            <svg
              width="14" height="14"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 1.16 2 2 0 014 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.91 8.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call
          </a>

          {/* WhatsApp — violet gradient pill */}
          <a
            href={`https://wa.me/${service.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-sm active:scale-95 transition-transform"
            style={{
              fontFamily: "'Manrope', sans-serif",
              background: "linear-gradient(135deg, #b6a0ff, #7e51ff)",
              color: "#1c0060",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}