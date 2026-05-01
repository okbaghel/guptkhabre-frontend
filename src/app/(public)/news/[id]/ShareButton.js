"use client";

import { useState } from "react";

export default function ShareButton({ url, title }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Ensure the URL is absolute (needed for navigator.share on some platforms)
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;

    if (navigator.share) {
      navigator.share({ title, url: fullUrl }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(fullUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      className={`nd-share-btn${copied ? " nd-copied" : ""}`}
      onClick={handleShare}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Share Article
        </>
      )}
    </button>
  );
}
