"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit             from "@tiptap/starter-kit";
import TextAlign              from "@tiptap/extension-text-align";
import Highlight              from "@tiptap/extension-highlight";
import Link                   from "@tiptap/extension-link";
import Image                  from "@tiptap/extension-image";
import Placeholder            from "@tiptap/extension-placeholder";
import { TextStyle }          from "@tiptap/extension-text-style"; // named export in Tiptap 3
import Color                  from "@tiptap/extension-color";
import { useCallback, useState } from "react";

// ── Toolbar button ────────────────────────────────────────────────────────────
function Btn({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`re-btn${active ? " re-btn--active" : ""}`}
    >
      {children}
    </button>
  );
}

// ── SVG icons (inline, no external dep) ──────────────────────────────────────
const I = {
  Bold:       <><path strokeWidth="2.5" strokeLinecap="round" d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path strokeWidth="2.5" strokeLinecap="round" d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></>,
  Italic:     <><line x1="19" y1="4" x2="10" y2="4" strokeWidth="2" strokeLinecap="round"/><line x1="14" y1="20" x2="5" y2="20" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="4" x2="9" y2="20" strokeWidth="2" strokeLinecap="round"/></>,
  Underline:  <><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="21" x2="20" y2="21" strokeWidth="2" strokeLinecap="round"/></>,
  Strike:     <><path d="M16 4H9a4 4 0 0 0-4 4c0 1.4.73 2.2 1.7 3.3" strokeWidth="2" strokeLinecap="round"/><path d="M8 20h7a4 4 0 0 0 4-4c0-1.4-.73-2.2-1.7-3.3" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round"/></>,
  Code:       <><polyline points="16 18 22 12 16 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  Quote:      <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" strokeWidth="1.5" strokeLinecap="round"/></>,
  BulletList: <><line x1="8" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" strokeLinecap="round"/></>,
  NumList:    <><line x1="10" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="10" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="10" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/><path d="M4 6h1v4" strokeWidth="1.8" strokeLinecap="round"/><path d="M4 10h2" strokeWidth="1.8" strokeLinecap="round"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeWidth="1.8" strokeLinecap="round"/></>,
  AlignL:     <><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="15" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/></>,
  AlignC:     <><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="12" x2="18" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/></>,
  AlignR:     <><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/></>,
  Highlight:  <><path d="m9 11-6 6v3h9l3-3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
  Link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  Image:      <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/><polyline points="21 15 16 10 5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  Undo:       <><polyline points="9 14 4 9 9 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 20v-7a4 4 0 0 0-4-4H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  Redo:       <><polyline points="15 14 20 9 15 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20v-7a4 4 0 0 1 4-4h12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
};

function Svg({ d }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {d}
    </svg>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Sep() { return <div className="re-sep" />; }

// ── Main component ────────────────────────────────────────────────────────────
export default function RichEditor({ content = "", onChange, placeholder = "Write your article content here…" }) {
  const [linkUrl, setLinkUrl]     = useState("");
  const [showLink, setShowLink]   = useState(false);
  const [imageUrl, setImageUrl]   = useState("");
  const [showImage, setShowImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // required in Next.js — avoids SSR hydration mismatch error
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: { class: "re-prose" },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setShowLink(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    }
    setImageUrl("");
    setShowImage(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  const headingLevel = [1, 2, 3, 4].find((l) => editor.isActive("heading", { level: l }));

  return (
    <>
      <style>{`
        .re-wrap {
          border: 1px solid var(--ap-input-border, rgba(255,255,255,0.08));
          border-radius: 12px;
          overflow: hidden;
          background: var(--ap-input-bg, rgba(255,255,255,0.04));
          transition: border-color 0.2s;
        }
        .re-wrap:focus-within {
          border-color: var(--ap-input-focus, rgba(124,58,237,0.5));
          box-shadow: 0 0 0 3px rgba(124,58,237,0.10);
        }

        /* ── Toolbar ── */
        .re-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 8px 10px;
          border-bottom: 1px solid var(--ap-input-border, rgba(255,255,255,0.08));
          background: var(--ap-card, rgba(255,255,255,0.025));
        }

        .re-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--ap-muted, #9ca3af);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          padding: 0;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
        }
        .re-btn:hover:not(:disabled) {
          background: rgba(124,58,237,0.12);
          color: #a78bfa;
        }
        .re-btn--active {
          background: rgba(124,58,237,0.18);
          color: #a78bfa;
        }
        .re-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .re-sep {
          width: 1px;
          height: 22px;
          background: var(--ap-input-border, rgba(255,255,255,0.08));
          margin: 3px 4px;
          align-self: center;
          flex-shrink: 0;
        }

        .re-select {
          height: 28px;
          padding: 0 8px;
          border-radius: 6px;
          border: 1px solid var(--ap-input-border, rgba(255,255,255,0.08));
          background: var(--ap-input-bg, rgba(255,255,255,0.05));
          color: var(--ap-text, #f1f1f3);
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          outline: none;
        }
        .re-select:focus { border-color: rgba(124,58,237,0.4); }

        /* ── Editor area ── */
        .re-prose {
          min-height: 220px;
          max-height: 520px;
          overflow-y: auto;
          padding: 14px 16px;
          outline: none;
          font-size: 14px;
          line-height: 1.75;
          color: var(--ap-text, #f1f1f3);
          font-family: 'Figtree', sans-serif;
          word-break: break-word;
        }

        /* Typography inside the editor */
        .re-prose h1 { font-size: 1.75em; font-weight: 700; margin: 0.6em 0 0.3em; line-height: 1.25; }
        .re-prose h2 { font-size: 1.45em; font-weight: 700; margin: 0.6em 0 0.3em; }
        .re-prose h3 { font-size: 1.2em;  font-weight: 600; margin: 0.6em 0 0.3em; }
        .re-prose h4 { font-size: 1.05em; font-weight: 600; margin: 0.5em 0 0.25em; }
        .re-prose p  { margin: 0 0 0.75em; }
        .re-prose ul { list-style: disc;    padding-left: 1.4em; margin: 0.5em 0; }
        .re-prose ol { list-style: decimal; padding-left: 1.4em; margin: 0.5em 0; }
        .re-prose li { margin: 0.2em 0; }
        .re-prose blockquote {
          border-left: 3px solid #7c3aed;
          padding: 6px 14px;
          margin: 0.75em 0;
          color: var(--ap-muted, #9ca3af);
          font-style: italic;
        }
        .re-prose code {
          font-family: 'Fira Mono', 'Courier New', monospace;
          font-size: 0.88em;
          background: rgba(124,58,237,0.12);
          border-radius: 4px;
          padding: 1px 5px;
        }
        .re-prose pre {
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 12px 16px;
          overflow-x: auto;
          margin: 0.75em 0;
        }
        .re-prose pre code { background: none; padding: 0; }
        .re-prose a { color: #a78bfa; text-decoration: underline; }
        .re-prose img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
        .re-prose mark { background: rgba(251,191,36,0.25); border-radius: 3px; padding: 1px 2px; }
        .re-prose hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1em 0; }

        /* Placeholder */
        .re-prose p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--ap-label, #6b7280);
          pointer-events: none;
          height: 0;
          float: left;
        }

        /* ── Link/Image popover ── */
        .re-popover {
          display: flex;
          gap: 6px;
          padding: 8px 10px;
          background: var(--ap-card, rgba(20,20,30,0.98));
          border: 1px solid var(--ap-card-border, rgba(255,255,255,0.07));
          border-radius: 10px;
          margin: 0 10px 8px;
          align-items: center;
        }
        .re-popover input {
          flex: 1;
          height: 32px;
          background: var(--ap-input-bg, rgba(255,255,255,0.05));
          border: 1px solid var(--ap-input-border, rgba(255,255,255,0.08));
          border-radius: 8px;
          padding: 0 10px;
          font-size: 13px;
          color: var(--ap-text, #f1f1f3);
          font-family: inherit;
          outline: none;
        }
        .re-popover input:focus { border-color: rgba(124,58,237,0.4); }
        .re-popover button {
          height: 32px;
          padding: 0 12px;
          border-radius: 8px;
          border: none;
          background: #7c3aed;
          color: #fff;
          font-size: 12.5px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
        }
        .re-popover-cancel {
          height: 32px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid var(--ap-input-border, rgba(255,255,255,0.08));
          background: transparent;
          color: var(--ap-muted, #9ca3af);
          font-size: 12.5px;
          font-family: inherit;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .re-prose { min-height: 160px; font-size: 13.5px; }
          .re-toolbar { gap: 1px; padding: 6px 8px; }
        }
      `}</style>

      <div className="re-wrap">
        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="re-toolbar" onMouseDown={(e) => e.preventDefault()}>

          {/* Heading selector */}
          <select
            className="re-select"
            value={headingLevel ? `h${headingLevel}` : "p"}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else editor.chain().focus().setHeading({ level: Number(v.slice(1)) }).run();
            }}
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <Sep />

          {/* Format */}
          <Btn active={editor.isActive("bold")}      onClick={() => editor.chain().focus().toggleBold().run()}      title="Bold"><Svg d={I.Bold} /></Btn>
          <Btn active={editor.isActive("italic")}    onClick={() => editor.chain().focus().toggleItalic().run()}    title="Italic"><Svg d={I.Italic} /></Btn>
          <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><Svg d={I.Underline} /></Btn>
          <Btn active={editor.isActive("strike")}    onClick={() => editor.chain().focus().toggleStrike().run()}    title="Strikethrough"><Svg d={I.Strike} /></Btn>
          <Btn active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><Svg d={I.Highlight} /></Btn>
          <Btn active={editor.isActive("code")}      onClick={() => editor.chain().focus().toggleCode().run()}      title="Inline code"><Svg d={I.Code} /></Btn>

          <Sep />

          {/* Alignment */}
          <Btn active={editor.isActive({ textAlign: "left" })}    onClick={() => editor.chain().focus().setTextAlign("left").run()}    title="Align left"><Svg d={I.AlignL} /></Btn>
          <Btn active={editor.isActive({ textAlign: "center" })}  onClick={() => editor.chain().focus().setTextAlign("center").run()}  title="Align center"><Svg d={I.AlignC} /></Btn>
          <Btn active={editor.isActive({ textAlign: "right" })}   onClick={() => editor.chain().focus().setTextAlign("right").run()}   title="Align right"><Svg d={I.AlignR} /></Btn>

          <Sep />

          {/* Lists */}
          <Btn active={editor.isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()}  title="Bullet list"><Svg d={I.BulletList} /></Btn>
          <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><Svg d={I.NumList} /></Btn>
          <Btn active={editor.isActive("blockquote")}  onClick={() => editor.chain().focus().toggleBlockquote().run()}  title="Blockquote"><Svg d={I.Quote} /></Btn>
          <Btn active={editor.isActive("codeBlock")}   onClick={() => editor.chain().focus().toggleCodeBlock().run()}   title="Code block"><Svg d={I.Code} /></Btn>

          <Sep />

          {/* Link */}
          <Btn active={editor.isActive("link")} onClick={() => { setShowLink((v) => !v); setShowImage(false); }} title="Insert link"><Svg d={I.Link} /></Btn>

          {/* Image */}
          <Btn onClick={() => { setShowImage((v) => !v); setShowLink(false); }} title="Insert image"><Svg d={I.Image} /></Btn>

          <Sep />

          {/* Undo / Redo */}
          <Btn disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} title="Undo"><Svg d={I.Undo} /></Btn>
          <Btn disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} title="Redo"><Svg d={I.Redo} /></Btn>
        </div>

        {/* ── Link popover ── */}
        {showLink && (
          <div className="re-popover">
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setLink(); if (e.key === "Escape") setShowLink(false); }}
              autoFocus
            />
            <button onClick={setLink}>Insert</button>
            <button className="re-popover-cancel" onClick={() => { setShowLink(false); setLinkUrl(""); }}>✕</button>
          </div>
        )}

        {/* ── Image URL popover ── */}
        {showImage && (
          <div className="re-popover">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") insertImage(); if (e.key === "Escape") setShowImage(false); }}
              autoFocus
            />
            <button onClick={insertImage}>Insert</button>
            <button className="re-popover-cancel" onClick={() => { setShowImage(false); setImageUrl(""); }}>✕</button>
          </div>
        )}

        {/* ── Editor content ── */}
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
