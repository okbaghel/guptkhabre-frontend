"use client";

import Navbar from "@/components/common/Navbar";
import StoryBar from "@/components/common/StoryBar";
import PostList from "@/components/common/PostList";

export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@600;700&display=swap');

        /* ── Base resets ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Theme tokens (applied on html via Navbar toggle) ── */
        :root, [data-gk-theme="dark"] {
          --bg-page:      #0a0a0a;
          --bg-surface:   #111111;
          --text-primary: #FFFFFF;
          --text-muted:   rgba(255,255,255,0.50);
          --border:       rgba(255,255,255,0.08);
          --red:          #DD0000;
          --red-bright:   #FF2E2E;
        }
        [data-gk-theme="light"] {
          --bg-page:      #F0F0F0;
          --bg-surface:   #FFFFFF;
          --text-primary: #0a0a0a;
          --text-muted:   rgba(0,0,0,0.50);
          --border:       rgba(0,0,0,0.10);
          --red:          #DD0000;
          --red-bright:   #FF2E2E;
        }

        html, body {
          min-height: 100%;
          background: var(--bg-page);
          color: var(--text-primary);
          transition: background 0.25s ease, color 0.25s ease;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Layout ── */
        .hp-root {
          min-height: 100svh;
          background: var(--bg-page);
        }

        .hp-main {
          max-width: 680px;
          margin: 0 auto;
          padding: 72px 0 100px;
        }

        /* ── Story section ── */
        .hp-stories {
          border-bottom: 1px solid var(--border);
          padding: 0 0 4px;
          margin-bottom: 4px;
        }

        /* ── Section divider ── */
        .hp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 16px 10px;
        }
        .hp-divider-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--red);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .hp-divider-rule {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ── Posts section ── */
        .hp-posts {
          padding: 0 12px;
        }

        /* ── Mobile safe area ── */
        @media (max-width: 767px) {
          .hp-main { padding-bottom: 88px; }
        }
      `}</style>

      <div className="hp-root">
        <Navbar />

        <main className="hp-main">

          {/* Stories strip */}
          <section className="hp-stories" aria-label="Stories">
            <StoryBar />
          </section>

          {/* Feed label */}
          <div className="hp-divider">
            <span className="hp-divider-label">Latest News</span>
            <div className="hp-divider-rule" />
          </div>

          {/* Post feed */}
          <section className="hp-posts" aria-label="News feed">
            <PostList />
          </section>

        </main>
      </div>
    </>
  );
}