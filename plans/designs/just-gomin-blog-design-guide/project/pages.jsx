// pages.jsx — page-level components
const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP, useRef: useRefP } = React;

/* ╔══ HOME ════════════════════════════════════════════════════════╗ */
function HomePage({ go }) {
  const [shown, setShown] = useStateP(0);
  // sequential reveal
  useEffectP(() => {
    setShown(0);
    const t = setTimeout(() => setShown(1), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 64, padding: "48px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="section-label">[ Just-gomin / log / 2026 ]</span>
        <AsciiDivider />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 64, paddingLeft: 24 }}>
        {SLOGANS.map((s, i) => (
          <SloganBlock key={i} en={s.en} ko={s.ko} segments={s.segments} index={i} />
        ))}
      </div>

    </div>
  );
}

function SloganBlock({ en, ko, segments, index }) {
  const [reveal, setReveal] = useStateP(false);
  const [cycle, setCycle] = useStateP(0);
  useEffectP(() => {
    const t = setTimeout(() => setReveal(true), 200 + index * 1200);
    return () => clearTimeout(t);
  }, [index]);

  const handleDone = () => {
    const t = setTimeout(() => {
      setReveal(false);
      const t2 = setTimeout(() => {
        setCycle((c) => c + 1);
        setReveal(true);
      }, 200);
      return () => clearTimeout(t2);
    }, 5000);
    return () => clearTimeout(t);
  };

  return (
    <div className="slogan">
      <span style={{ color: "var(--c-fg-muted)", fontWeight: 400, marginRight: 12 }}>
        $
      </span>
      {reveal ? (
        <Typewriter key={cycle} text={en} segments={segments} speed={26} onDone={handleDone} />
      ) : (
        <span style={{ opacity: 0 }}>{en}</span>
      )}
      <span className="ko" style={{ opacity: reveal ? 1 : 0, transition: "opacity 600ms 800ms" }}>
        // {ko}
      </span>
    </div>
  );
}

/* ╔══ RESUME ══════════════════════════════════════════════════════╗ */
function ResumePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "24px 0" }}>
      <PageTitle prefix="// resume">Just-gomin</PageTitle>
      <AsciiDivider label="profile" />
      <div className="resume-profile">
        {PROFILE_COLS.map((c) => (
          <div key={c.key} className="resume-profile-col">
            <span className="key">{c.key}</span>
            <span className="val">{c.val}</span>
          </div>
        ))}
      </div>

      <AsciiDivider label="career" />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {CAREER.map((c, i) => (
          <div key={i} className="resume-career">
            <div className="resume-career-leading">
              <span style={{ fontSize: 12, color: "var(--c-fg-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span className="role">{c.role}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--c-fg)" }}>{c.company}</span>
              <span className="period">{c.period}</span>
            </div>
            <div className="resume-career-body">
              {c.items.map((it, j) => (
                <div key={j} className="item">
                  <h4>{it.header}</h4>
                  <ul>
                    {it.lines.map((l, k) => <li key={k}>{l}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AsciiDivider label="contact" />
      <div style={{ fontSize: 16, paddingLeft: 12 }}>
        <div>$ mail<span style={{ color: "var(--c-fg-muted)" }}> → </span>
          <a className="link" href="mailto:just0gomin@gmail.com">just0gomin@gmail.com</a></div>
        <div>$ github<span style={{ color: "var(--c-fg-muted)" }}> → </span>
          <a className="link" href="https://github.com/Just-gomin" target="_blank" rel="noreferrer">github.com/Just-gomin</a></div>
      </div>
    </div>
  );
}

/* ╔══ NOTES LIST ══════════════════════════════════════════════════╗ */
function NotesPage({ go, initialTag = null }) {
  const [active, setActive] = useStateP(initialTag ? [initialTag] : []);
  const [q, setQ] = useStateP("");
  const filtered = useMemoP(() => {
    return NOTES.filter((n) => {
      if (active.length && !active.every((t) => n.tags.includes(t))) return false;
      if (q && !(`${n.title}${n.summary}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [active, q]);

  const toggle = (t) => setActive((a) => a.includes(t) ? a.filter((x) => x !== t) : [...a, t]);

  return (
    <div className="notes-grid" style={{ padding: "16px 0 24px" }}>
      <aside className="notes-sidebar">
        <div className="notes-sidebar-head">
          <span>FILTER</span>
          {active.length > 0 && (
            <span className="clear" onClick={() => setActive([])}>CLEAR</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 12px" }}>
          {TAGS.map((t) => (
            <Tag
              key={t.label}
              label={t.label}
              count={t.count}
              active={active.includes(t.label)}
              onClick={() => toggle(t.label)}
            />
          ))}
        </div>
      </aside>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="search">
          <span className="prompt">/</span>
          <input
            placeholder="search title or summary…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          {q && <span style={{ color: "var(--c-fg-muted)", fontSize: 12 }}>{filtered.length} matches</span>}
        </div>
        <div className="notes-list-head">
          <span>WHEN &amp; WHERE</span>
          <span>TITLE</span>
          <span style={{ textAlign: "right" }}>TAGS</span>
        </div>
        <div>
          {filtered.length === 0 ? (
            <EmptyState
              title="아무것도 찾지 못했어요."
              hint={q ? `'${q}' 와(과) 일치하는 노트가 없습니다.` : "필터 조건과 일치하는 노트가 없습니다."}
            />
          ) : (
            filtered.map((n) => (
              <div key={n.id} className="note-row" onClick={() => go(`/notes/${n.id}`)}>
                <div className="note-when">
                  <span>{n.when}</span>
                  <span className="where">{n.where}</span>
                </div>
                <div>
                  <div className="note-title">{n.title}</div>
                  <div style={{ fontSize: 14, color: "var(--c-fg-muted)", marginTop: 4 }}>{n.summary}</div>
                </div>
                <div className="note-tags">
                  {n.tags.map((t) => (
                    <Tag key={t} label={t} onClick={(e) => { e.stopPropagation(); toggle(t); }} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ title, hint }) {
  return (
    <div style={{ padding: "64px 0", textAlign: "center", color: "var(--c-fg-muted)" }}>
      <div style={{ fontWeight: 700, color: "var(--c-fg)", fontSize: 20, marginBottom: 8 }}>
        [ ] {title}
      </div>
      <div style={{ fontSize: 14 }}>{hint}</div>
      <pre className="ascii-404" style={{ marginTop: 24, fontSize: 12 }}>
{`        ·  ·  ·
     /        \\
    │   ___    │
     \\  ___  /
        ·  ·`}
      </pre>
    </div>
  );
}

/* ╔══ NOTE DETAIL ═════════════════════════════════════════════════╗ */
function NotePage({ id, go }) {
  const note = NOTES.find((n) => n.id === id) || NOTES[0];
  const [activeId, setActiveId] = useStateP("intro");

  // Mock body — uses every supported block type
  const TOC = [
    { id: "intro",      label: "들어가며",                  level: 2 },
    { id: "context",    label: "맥락",                     level: 3 },
    { id: "approach",   label: "접근 방식",                 level: 2 },
    { id: "principles", label: "원칙",                     level: 3 },
    { id: "code",       label: "코드로 보기",                level: 3 },
    { id: "checklist",  label: "체크리스트",                 level: 3 },
    { id: "table",      label: "비교 표",                   level: 3 },
    { id: "closing",    label: "마치며",                    level: 2 },
  ];

  // Scroll-spy
  useEffectP(() => {
    const headings = TOC.map((t) => document.getElementById(t.id)).filter(Boolean);
    const handler = () => {
      let current = TOC[0].id;
      const scrollY = window.scrollY + 120;
      headings.forEach((h) => {
        if (h && h.offsetTop <= scrollY) current = h.id;
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [id]);

  const scrollTo = (e, hid) => {
    e.preventDefault();
    const el = document.getElementById(hid);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <div className="note-detail-grid">
      <div className="left">
        <div style={{ position: "sticky", top: 80, fontSize: 12, color: "var(--c-fg-muted)" }}>
          <div style={{ marginBottom: 8 }}>
            <a className="link" href="/notes" onClick={(e) => { e.preventDefault(); go("/notes"); }}>← back to notes</a>
          </div>
          <div>{note.when}</div>
          <div style={{ marginTop: 4, color: "var(--c-fg)", fontWeight: 700 }}>{note.where}</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
            {note.tags.map((t) => (
              <a key={t} href="#" onClick={(e) => { e.preventDefault(); go(`/tag/${t}`); }}>#{t}</a>
            ))}
          </div>
        </div>
      </div>

      <article className="content" data-comment-anchor={`note-${id}`}>
        <h1 className="md-h1">{note.title}</h1>
        <div style={{ fontSize: 14, color: "var(--c-fg-muted)", marginBottom: 16 }}>
          {note.summary}
        </div>

        <details className="toc-inline mobile-only">
          <summary>
            <span>// table of contents</span>
            <span className="chev">▸</span>
          </summary>
          <div className="toc-inline-body">
            {TOC.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`${t.level === 2 ? "h2" : "h3"}${activeId === t.id ? " is-active" : ""}`}
                onClick={(e) => scrollTo(e, t.id)}
              >
                {t.level === 2 ? "# " : "## "}{t.label}
              </a>
            ))}
          </div>
        </details>

        <h2 id="intro" className="md-h2"># 들어가며</h2>
        <div className="md-body">
          <p>이 글은 <code className="inline">CLAUDE.md</code> 를 단순한 설정 파일이 아니라, 에이전트와의 협업을 위한 <em>컨텍스트의 출발점</em> 으로 사용해 본 한 달의 기록입니다.</p>
        </div>

        <h3 id="context" className="md-h3">## 맥락</h3>
        <div className="md-body">
          <p>한 달 동안 매일 다른 작업을 다른 에이전트에게 위임하면서, 매번 같은 문맥을 다시 설명하고 있다는 걸 깨달았습니다.</p>
        </div>

        <Callout kind="note">
          이 글은 특정 도구의 사용법이 아니라, <strong>반복되는 의사 결정을 어떻게 외부화할 것인가</strong> 에 대한 메모입니다.
        </Callout>

        <h2 id="approach" className="md-h2"># 접근 방식</h2>
        <div className="md-body">
          <p>세 단계로 정리했습니다.</p>
        </div>

        <h3 id="principles" className="md-h3">## 원칙</h3>
        <CheckList items={[
          { text: "한 번 이상 설명한 것은 문서로 남긴다.", done: true },
          { text: "문서는 짧고 갱신 가능해야 한다.", done: true },
          { text: "에이전트와 사람이 같은 문서를 읽는다.", done: false },
        ]} />

        <Blockquote author="자기 자신, 2026">
          반복되는 결정을 줄이는 것이 곧 사고의 여백을 만드는 일이다.
        </Blockquote>

        <h3 id="code" className="md-h3">## 코드로 보기</h3>
        <div className="md-body">
          <p>실제로 사용 중인 <code className="inline">CLAUDE.md</code> 의 일부:</p>
        </div>
        <CodeBlock lang="Markdown">{`# Project: Just-gomin.blog

## Style
- All monospace (NanumGothicCoding)
- One accent color (#6B2C39, deep wine)
- [x] / [ ] checkbox metaphor for navigation

## Don'ts
- Don't introduce sans-serif body text
- Don't add gradient backgrounds
- Don't replace ASCII dividers with hairline rules
`}</CodeBlock>

        <Callout kind="warn">
          모든 결정을 <code className="inline">CLAUDE.md</code> 에 넣지 마세요. 자주 바뀌는 것과 거의 바뀌지 않는 것을 분리해야 합니다.
        </Callout>

        <h3 id="checklist" className="md-h3">## 체크리스트</h3>
        <Toggle summary="실제 적용해 본 패턴 5가지" defaultOpen>
          <ol className="md-list">
            <li>도메인 어휘 사전</li>
            <li>금지된 표현 / 패턴 목록</li>
            <li>예시 입출력</li>
            <li>실패한 시도와 그 이유</li>
            <li>현재 작업의 상태(Working / Blocked / Done)</li>
          </ol>
        </Toggle>

        <h3 id="table" className="md-h3">## 비교 표</h3>
        <table className="md-table">
          <thead>
            <tr><th>대상</th><th>이전</th><th>이후</th></tr>
          </thead>
          <tbody>
            <tr><td>onboarding 시간</td><td>40min</td><td>5min</td></tr>
            <tr><td>의사결정 반복</td><td>매 세션</td><td>1회</td></tr>
            <tr><td>문서 길이</td><td>0줄</td><td>120줄</td></tr>
          </tbody>
        </table>

        <Embed url="https://github.com/Just-gomin/Just-gomin.github.io" title="Just-gomin.github.io · Repository" />

        <h2 id="closing" className="md-h2"># 마치며</h2>
        <div className="md-body">
          <p>완성된 것이 완벽한 것보다 낫다. 이 문서 역시 그렇다.</p>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "var(--line-faint)", display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <a className="link" href="/notes" onClick={(e) => { e.preventDefault(); go("/notes"); }}>← all notes</a>
          <span style={{ color: "var(--c-fg-muted)" }}>last edited {note.when}</span>
        </div>
      </article>

      <aside className="right">
        <div className="toc">
          <div className="toc-title" style={{ marginBottom: 12 }}>
            <span>TABLE OF<br/>CONTENTS</span>
            <Cursor accent />
          </div>
          {TOC.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={`${t.level === 2 ? "h2" : "h3"}${activeId === t.id ? " is-active" : ""}`}
              onClick={(e) => scrollTo(e, t.id)}
            >
              {t.label}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ╔══ ABOUT ═══════════════════════════════════════════════════════╗ */
function AboutPage({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "24px 0", maxWidth: 720, marginInline: "auto" }}>
      <PageTitle prefix="// about">whoami</PageTitle>
      <AsciiDivider />

      <section className="md-body" style={{ fontSize: 18, lineHeight: 1.8 }}>
        <p>
          안녕하세요. <strong>안강민</strong> 입니다. Just-gomin 이라는 이름으로
          개발과 기록을 합니다.
        </p>
        <p>
          1995년에 태어났고, 지금은 <a className="link" href="https://beyo.io" target="_blank" rel="noreferrer">beyo</a>
          {" "}에서 Product Engineer 로 일합니다. 주로 AI 가 만들어 내는 무언가를
          사람이 쓸 만한 무언가로 옮기는 일을 합니다.
        </p>
        <p>
          이 블로그는 그런 일을 하면서 떠오른 생각들을 <em>읽고, 쓰고, 정리하는</em>
          공간입니다. 누군가에게 도움이 되면 좋고, 안 되어도 미래의 저에게는 도움이 됩니다.
        </p>
      </section>

      <AsciiDivider label="interests" />
      <div className="md-body">
        <p>제가 관심 있는 것들 — 시간, 장소, 사람, 기록, 생산성, 연결.</p>
      </div>

      <AsciiDivider label="tools" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { name: "Notion", use: "회고 / 기록" },
          { name: "Obsidian", use: "지식 그래프" },
          { name: "Naver Map", use: "장소 기록" },
          { name: "Claude Code", use: "페어 프로그래밍" },
          { name: "Cursor", use: "에디터" },
          { name: "Flutter", use: "앱" },
        ].map((t) => (
          <div key={t.name} className="box-faint box">
            <div style={{ fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: "var(--c-fg-muted)", marginTop: 4 }}>{t.use}</div>
          </div>
        ))}
      </div>

      <AsciiDivider label="contact" />
      <div className="md-body">
        <p>
          <a className="link" href="mailto:just0gomin@gmail.com">just0gomin@gmail.com</a> 로
          편하게 메일 주세요.
        </p>
      </div>
    </div>
  );
}

/* ╔══ TAG ═════════════════════════════════════════════════════════╗ */
function TagPage({ tag, go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "16px 0" }}>
      <PageTitle prefix="// tag">#{tag}</PageTitle>
      <AsciiDivider />
      <NotesPage go={go} initialTag={tag} />
    </div>
  );
}

/* ╔══ SEARCH ══════════════════════════════════════════════════════╗ */
function SearchPage({ go }) {
  const [q, setQ] = useStateP("");
  const results = useMemoP(() => {
    if (!q.trim()) return [];
    const qq = q.toLowerCase();
    return NOTES.filter((n) =>
      `${n.title} ${n.summary} ${n.tags.join(" ")}`.toLowerCase().includes(qq)
    );
  }, [q]);
  const inputRef = useRefP(null);
  useEffectP(() => { inputRef.current && inputRef.current.focus(); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 0", width: "100%", maxWidth: 720, marginInline: "auto" }}>
      <PageTitle prefix="// search" cursor={!q}>find</PageTitle>
      <div className="search">
        <span className="prompt">grep</span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색어를 입력해보세요…"
        />
        <span className="kbd-hint"><kbd>esc</kbd> to close</span>
      </div>

      {!q ? (
        <div style={{ fontSize: 14, color: "var(--c-fg-muted)" }}>
          <div>최근 검색 — <em style={{ color: "var(--c-fg)" }}>없음</em></div>
          <div style={{ marginTop: 16 }}>인기 태그</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {TAGS.slice(0, 6).map((t) => (
              <Tag key={t.label} label={t.label} count={t.count} onClick={() => go(`/tag/${t.label}`)} />
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState title={`'${q}' 는 어디에도 없어요.`} hint="다른 키워드를 시도해 보세요." />
      ) : (
        <div>
          <div style={{ fontSize: 12, color: "var(--c-fg-muted)", marginBottom: 8 }}>{results.length} 개 결과</div>
          {results.map((n) => (
            <div key={n.id} className="note-row" onClick={() => go(`/notes/${n.id}`)}>
              <div className="note-when"><span>{n.when}</span><span className="where">{n.where}</span></div>
              <div>
                <div className="note-title" dangerouslySetInnerHTML={{ __html: highlightMatch(n.title, q) }} />
                <div style={{ fontSize: 14, color: "var(--c-fg-muted)", marginTop: 4 }}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(n.summary, q) }} />
              </div>
              <div className="note-tags">
                {n.tags.slice(0, 2).map((t) => <Tag key={t} label={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function highlightMatch(text, q) {
  if (!q) return text;
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return esc(text).replace(re, '<mark style="background:var(--c-accent-soft);color:var(--c-accent);padding:0 2px">$1</mark>');
}

/* ╔══ 404 ═════════════════════════════════════════════════════════╗ */
function NotFoundPage({ go, route }) {
  return (
    <div style={{ padding: "64px 0", display: "flex", flexDirection: "column", gap: 32, alignItems: "center", textAlign: "center" }}>
      <pre className="ascii-404">
{`  _  _    ___  _  _ 
 | || |  / _ \\| || |
 | || |_| | | | || |_
 |__   _| | | |__   _|
    | | | |_| |  | |
    |_|  \\___/   |_|`}
      </pre>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>요청하신 페이지를 찾을 수 없어요.</div>
        <div style={{ marginTop: 8, color: "var(--c-fg-muted)" }}>
          <code className="inline">{route}</code> 는 존재하지 않는 경로입니다.
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
        <a className="link" href="/" onClick={(e) => { e.preventDefault(); go("/"); }}>← home</a>
        <a className="link" href="/notes" onClick={(e) => { e.preventDefault(); go("/notes"); }}>browse notes</a>
        <a className="link" href="/search" onClick={(e) => { e.preventDefault(); go("/search"); }}>search</a>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomePage, ResumePage, NotesPage, NotePage,
  AboutPage, TagPage, SearchPage, NotFoundPage,
});
