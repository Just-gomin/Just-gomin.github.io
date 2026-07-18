// design-system.jsx — single-page reference
function DesignSystemPage({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "16px 0" }}>
      <PageTitle prefix="// design-system">Just-gomin.blog — v0.1</PageTitle>
      <AsciiDivider />
      <div style={{ fontSize: 14, color: "var(--c-fg-muted)", maxWidth: 640 }}>
        텍스트 기반의 수려한 모노스페이스 블로그를 위한 첫 번째 디자인 시스템.
        터미널의 어휘([x], $, // 등)를 차용하되, 본문은 읽기 위한 공간으로 비워 둔다.
      </div>

      {/* Colors */}
      <DSSection id="colors" title="01 / Colors">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
          {[
            ["--c-fg",        "#7C7365", "Primary text · borders"],
            ["--c-fg-strong", "#5C5347", "Strong / hover"],
            ["--c-fg-muted",  "#B8AE9E", "Captions, meta"],
            ["--c-fg-faint",  "#DDD2C2", "Faint stroke"],
            ["--c-bg",        "#FBFAFA", "Paper background"],
            ["--c-bg-sub",    "#F6F2EC", "Subtle fill"],
            ["--c-bg-code",   "#F2EEE9", "Code block bg"],
            ["--c-accent",    "#6B2C39", "Accent (wine)"],
          ].map(([v, hex, note]) => (
            <div key={v} className="swatch">
              <div className="chip" style={{ background: hex }} />
              <div className="meta">
                <span className="name">{v}</span>
                <span className="val">{hex}</span>
                <span className="val">{note}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 14, color: "var(--c-fg-muted)" }}>
          포인트 컬러는 Tweaks 패널에서 wine · olive · indigo · rust 로 전환 가능합니다.
        </div>
      </DSSection>

      {/* Type */}
      <DSSection id="type" title="02 / Type — NanumGothicCoding only">
        {[
          { tag: "H1 / 32 / 700", style: { fontSize: 32, fontWeight: 700 } },
          { tag: "H2 / 24 / 700", style: { fontSize: 24, fontWeight: 700 } },
          { tag: "H3 / 20 / 700", style: { fontSize: 20, fontWeight: 700 } },
          { tag: "Body / 16 / 400", style: { fontSize: 16 } },
          { tag: "Caption / 14 / 400", style: { fontSize: 14, color: "var(--c-fg-muted)" } },
          { tag: "Label / 12 / 700", style: { fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" } },
          { tag: "Display / 48 / 700", style: { fontSize: 48, fontWeight: 700, lineHeight: 1.2 } },
        ].map((r) => (
          <div key={r.tag} className="type-row">
            <span className="meta">{r.tag}</span>
            <span className="sample" style={r.style}>The quick brown 여우가 jumps. 1234567890</span>
          </div>
        ))}
      </DSSection>

      {/* Spacing */}
      <DSSection id="spacing" title="03 / Spacing — 4px grid">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[4, 8, 12, 16, 20, 24, 32, 48, 64].map((n) => (
            <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: n, height: n, background: "var(--c-accent)" }} />
              <span style={{ fontSize: 12, color: "var(--c-fg-muted)" }}>{n}</span>
            </div>
          ))}
        </div>
      </DSSection>

      {/* Components */}
      <DSSection id="comp" title="04 / Components">
        <DSRow label="Checkbox nav">
          <Check active>HOME</Check>{"  "}<Check>RESUME</Check>{"  "}<Check>NOTES</Check>
        </DSRow>
        <DSRow label="Cursor"><span>typing</span><Cursor accent /></DSRow>
        <DSRow label="Tag">
          <Tag label="Design" count={3} />{" "}<Tag label="AI" count={5} active />{" "}<Tag label="Essay" count={2} />
        </DSRow>
        <DSRow label="ASCII divider"><AsciiDivider /></DSRow>
        <DSRow label="ASCII labeled divider"><AsciiDivider label="section" /></DSRow>
        <DSRow label="Callout · note"><Callout kind="note">사소한 환기.</Callout></DSRow>
        <DSRow label="Callout · warn"><Callout kind="warn">주의가 필요한 부분.</Callout></DSRow>
        <DSRow label="Blockquote"><Blockquote author="자기 자신">생각이 글이 되기까지의 거리.</Blockquote></DSRow>
        <DSRow label="Code block">
          <CodeBlock lang="JavaScript">{'const greet = (name) => `Hello, ${name}!`;\n// console.log(greet("Just-gomin"));'}</CodeBlock>
        </DSRow>
        <DSRow label="Check list">
          <CheckList items={[
            { text: "디자인 시스템 v0.1", done: true },
            { text: "MDX 컴포넌트 확장", done: false },
            { text: "다크 모드 토큰 정리", done: true },
          ]} />
        </DSRow>
        <DSRow label="Toggle"><Toggle summary="펼치면 더 보입니다." defaultOpen={false}>접혀 있던 내용.</Toggle></DSRow>
        <DSRow label="Search input">
          <div className="search"><span className="prompt">/</span><input placeholder="검색어…" /></div>
        </DSRow>
      </DSSection>

      {/* Patterns */}
      <DSSection id="patterns" title="05 / Patterns">
        <DSRow label="Note row">
          <div className="note-row" style={{ borderTop: "var(--line-faint)" }}>
            <div className="note-when"><span>2026.04.28</span><span className="where">@HOME</span></div>
            <div className="note-title">노트 제목이 들어가는 자리입니다.</div>
            <div className="note-tags"><Tag label="Design" /><Tag label="Note" /></div>
          </div>
        </DSRow>
        <DSRow label="Page heading">
          <PageTitle prefix="// section">page title</PageTitle>
        </DSRow>
      </DSSection>

      {/* Principles */}
      <DSSection id="principles" title="06 / Principles">
        <ol className="md-list" style={{ fontSize: 16, lineHeight: 1.8 }}>
          <li>모노스페이스로 일관한다 — 본문, 코드, UI 모두.</li>
          <li>그래픽 대신 어휘를 쓴다 — <code className="inline">[x]</code>, <code className="inline">$</code>, <code className="inline">//</code>, <code className="inline">─</code>.</li>
          <li>색은 최소한으로 — 한 가지 포인트 컬러로 인터랙션을 표현한다.</li>
          <li>여백이 곧 디자인이다 — 4px 그리드, 라인은 최소한.</li>
          <li>읽기 위한 공간 — 본문 폭은 640px, 두꺼운 헤딩 위계.</li>
          <li>커서가 살아 있다 — 미세한 모션으로 페이지가 켜져 있음을 알린다.</li>
        </ol>
      </DSSection>
    </div>
  );
}

function DSSection({ id, title, children }) {
  return (
    <section id={id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, paddingBottom: 8, borderBottom: "var(--line-faint)" }}>{title}</h2>
      {children}
    </section>
  );
}

function DSRow({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, padding: "12px 0", borderBottom: "var(--line-faint)", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: "var(--c-fg-muted)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", paddingTop: 4 }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

Object.assign(window, { DesignSystemPage });
