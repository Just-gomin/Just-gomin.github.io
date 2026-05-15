// components.jsx — shared building blocks for Just-gomin.blog
const { useState, useEffect, useRef, useMemo } = React;

/* ── Cursor ─────────────────────────────────────────────────── */
function Cursor({ accent }) {
  return <span className={`cursor${accent ? " accent" : ""}`} />;
}

/* ── Checkbox-label (e.g. [x]HOME) ──────────────────────────── */
function Check({ active, children }) {
  return (
    <span>
      <span style={{ color: "var(--c-fg-muted)" }}>[</span>
      <span style={{ color: active ? "var(--c-accent)" : "var(--c-fg-muted)" }}>{active ? "x" : " "}</span>
      <span style={{ color: "var(--c-fg-muted)" }}>]</span>
      {children}
    </span>
  );
}

/* ── ASCII divider ─────────────────────────────────────────── */
function AsciiDivider({ label }) {
  if (label) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--c-fg-muted)", fontSize: 12 }}>
        <span style={{ flex: 1, borderBottom: "1px dashed var(--c-stroke-faint)" }} />
        <span style={{ fontWeight: 700, letterSpacing: "0.06em" }}>{label}</span>
        <span style={{ flex: 1, borderBottom: "1px dashed var(--c-stroke-faint)" }} />
      </div>
    );
  }
  return <div className="ascii-divider" aria-hidden="true" />;
}

/* ── Header / Nav ───────────────────────────────────────────── */
const NAV = [
  { key: "home", label: "HOME", path: "/", kbd: "h" },
  { key: "resume", label: "RESUME", path: "/resume", kbd: "r" },
  { key: "notes", label: "NOTES", path: "/notes", kbd: "n" },
  { key: "about", label: "ABOUT", path: "/about", kbd: "a" },
];

function Header({ route, go }) {
  const active = route.split("/")[1] || "home";
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [route]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = NAV.map((n) => {
    const isActive = (n.key === "home" && (route === "/" || route === ""))
      || (n.key !== "home" && active === n.key);
    return { ...n, isActive };
  });

  return (
    <header className="header" data-comment-anchor="header">
      <nav className="header-nav">
        {navLinks.map((n) => (
          <a
            key={n.key}
            href={n.path}
            className={n.isActive ? "is-active" : ""}
            onClick={(e) => { e.preventDefault(); go(n.path); }}
          >
            <Check active={n.isActive}>{n.label}</Check>
          </a>
        ))}
        <span className="kbd-hint" style={{ marginLeft: 12 }}>
          press <kbd>h</kbd><kbd>r</kbd><kbd>n</kbd><kbd>a</kbd> · search <kbd>/</kbd>
        </span>
      </nav>

      <button
        type="button"
        className="header-hamburger"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? "[x]" : "[≡]"}</span>
      </button>

      <a
        href="/"
        className="header-brand"
        onClick={(e) => { e.preventDefault(); go("/"); }}
      >
        Just-gomin<span className="dot">.</span>log
      </a>

      {open && (
        <>
          <div className="drawer-backdrop" onClick={() => setOpen(false)} />
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="메뉴">
            <div className="drawer-head">
              <span className="drawer-title">// menu</span>
              <button
                type="button"
                className="drawer-close"
                aria-label="닫기"
                onClick={() => setOpen(false)}
              >[x] close</button>
            </div>
            <AsciiDivider />
            <nav className="drawer-nav">
              {navLinks.map((n) => (
                <a
                  key={n.key}
                  href={n.path}
                  className={n.isActive ? "is-active" : ""}
                  onClick={(e) => { e.preventDefault(); go(n.path); }}
                >
                  <Check active={n.isActive}>{n.label}</Check>
                </a>
              ))}
              <a
                href="/search"
                onClick={(e) => { e.preventDefault(); go("/search"); }}
              >
                <Check>SEARCH</Check>
              </a>
            </nav>
            <AsciiDivider />
            <div className="drawer-foot">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); go("/design-system"); }}
              >design-system</a>
              <a
                href="https://github.com/Just-gomin"
                target="_blank"
                rel="noreferrer"
              >github ↗</a>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer({ go }) {
  return (
    <footer className="footer">
      <span>© 2026 Just-gomin · just0gomin@gmail.com</span>
      <span className="links">
        <a href="https://github.com/Just-gomin" target="_blank" rel="noreferrer">github</a>
        <span>·</span>
        <a href="#" onClick={(e) => { e.preventDefault(); go("/design-system"); }}>design-system</a>
        <span>·</span>
        <span>built with [x] care</span>
      </span>
    </footer>
  );
}

/* ── Layout wrapper ─────────────────────────────────────────── */
function Layout({ route, go, children }) {
  return (
    <div className="layout" data-screen-label={route}>
      <Header route={route} go={go} />
      <main className="page" key={route /* triggers re-mount for entry animation */}>
        {children}
      </main>
      <Footer go={go} />
    </div>
  );
}

/* ── Typewriter ─────────────────────────────────────────────── */
function Typewriter({ text, segments, speed = 24, delay = 0, onDone, cursor = true }) {
  const segs = segments || [{ text: text || "" }];
  const total = segs.reduce((n, s) => n + s.text.length, 0);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setI(0);
    setDone(false);
    let n = 0;
    let t1, t2;
    t1 = setTimeout(() => {
      const tick = () => {
        n++;
        setI(n);
        if (n < total) t2 = setTimeout(tick, speed);
        else { setDone(true); onDone && onDone(); }
      };
      tick();
    }, delay);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [total, speed, delay]);

  // slice segments up to i chars
  let remaining = i;
  const rendered = segs.map((s, k) => {
    const take = Math.max(0, Math.min(s.text.length, remaining));
    remaining -= take;
    const shown = s.text.slice(0, take);
    if (!shown) return null;
    if (s.href) {
      return <a key={k} className="link" href={s.href} target={s.external ? "_blank" : undefined} rel={s.external ? "noreferrer" : undefined}>{shown}</a>;
    }
    return <span key={k}>{shown}</span>;
  });
  return (
    <span>
      {rendered}
      {cursor && !done && <Cursor accent />}
    </span>
  );
}

/* ── Tag ────────────────────────────────────────────────────── */
function Tag({ label, count, active, onClick }) {
  return (
    <span
      className={`tag${active ? " is-active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="check">{active ? "x " : ""}</span>
      <span>#{label}</span>
      {count != null && (
        <span style={{ color: "var(--c-fg-muted)", marginLeft: 4 }}>{count}</span>
      )}
    </span>
  );
}

/* ── Copy button ────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="copy-btn"
      onClick={() => {
        navigator.clipboard?.writeText(text || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="12" height="12" rx="1" />
        <path d="M5 15V5a1 1 0 0 1 1-1h10" />
      </svg>
      {copied ? "copied" : "copy"}
    </button>
  );
}

/* ── Code block ────────────────────────────────────────────── */
function CodeBlock({ lang = "JavaScript", children }) {
  const text = typeof children === "string" ? children : "";
  return (
    <div className="codeblock">
      <div className="head">
        <span className="lang">
          <CopyButton text={text} />
          {lang}
        </span>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: highlight(text) }} />
    </div>
  );
}

// Simple JS-ish highlighter
function highlight(src) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let s = esc(src);
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>');
  s = s.replace(/("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/g, '<span class="tok-str">$1</span>');
  s = s.replace(/\b(const|let|var|function|return|if|else|for|while|new|import|export|from|default|async|await|class|extends|null|true|false|typeof|in|of)\b/g, '<span class="tok-kw">$1</span>');
  s = s.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="tok-fn">$1</span>');
  return s;
}

/* ── Callout ────────────────────────────────────────────────── */
function Callout({ kind = "note", children }) {
  return (
    <div className={`callout ${kind}`}>
      <span className="tag-label">{kind}</span>
      <div>{children}</div>
    </div>
  );
}

/* ── Toggle (collapsible) ───────────────────────────────────── */
function Toggle({ summary, children, defaultOpen = false }) {
  return (
    <details className="toggle" {...(defaultOpen ? { open: true } : {})}>
      <summary>
        <span className="chev">▸</span>
        {summary}
      </summary>
      <div className="body">{children}</div>
    </details>
  );
}

/* ── Blockquote ─────────────────────────────────────────────── */
function Blockquote({ author, children }) {
  return (
    <blockquote className="bq">
      {children}
      {author && <cite>— {author}</cite>}
    </blockquote>
  );
}

/* ── Check-list ────────────────────────────────────────────── */
function CheckList({ items }) {
  return (
    <ul className="md-list check">
      {items.map((it, i) => (
        <li key={i} className={it.done ? "done" : ""}>
          <span className="box-mark">[{it.done ? "x" : " "}]</span>
          <span className="text">{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Image placeholder ──────────────────────────────────────── */
function ImagePlaceholder({ label = "image", aspect = "16 / 9" }) {
  return (
    <div
      style={{
        aspectRatio: aspect,
        border: "var(--line-faint)",
        background:
          "repeating-linear-gradient(135deg, var(--c-bg-sub) 0 8px, var(--c-bg) 8px 16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--c-fg-muted)",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      [ {label} ]
    </div>
  );
}

/* ── Embed placeholder ──────────────────────────────────────── */
function Embed({ url, title }) {
  return (
    <div className="box-faint box" style={{ padding: 12 }}>
      <div style={{ fontSize: 12, color: "var(--c-fg-muted)", marginBottom: 4 }}>↗ embed</div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--c-fg-muted)" }}>{url}</div>
    </div>
  );
}

/* ── Section header with [#] marker ─────────────────────────── */
function PageTitle({ prefix, children, cursor = false }) {
  return (
    <h1 className="page-title">
      {prefix && <span className="prefix">{prefix}</span>}
      <span>{children}</span>
      {cursor && <Cursor accent />}
    </h1>
  );
}

Object.assign(window, {
  Cursor, Check, AsciiDivider, Header, Footer, Layout,
  Typewriter, Tag, CopyButton, CodeBlock, Callout, Toggle,
  Blockquote, CheckList, ImagePlaceholder, Embed, PageTitle,
  highlight, NAV,
});
