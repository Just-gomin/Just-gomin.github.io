// app.jsx — router + tweaks + mount
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mood": "terminal",
  "accent": "wine",
  "theme": "light"
}/*EDITMODE-END*/;

function parseRoute() {
  const h = (location.hash || "#/").replace(/^#/, "") || "/";
  return h;
}

function App() {
  const [route, setRoute] = useState(parseRoute());
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.mood = t.mood;
    document.documentElement.dataset.accent = t.accent;
  }, [t.theme, t.mood, t.accent]);

  const go = (path) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    location.hash = "#" + path;
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const map = { h: "/", r: "/resume", n: "/notes", a: "/about", s: "/search", d: "/design-system" };
      if (e.key === "/") { e.preventDefault(); go("/search"); }
      else if (map[e.key.toLowerCase()]) { go(map[e.key.toLowerCase()]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // route to page
  let page;
  const parts = route.split("/").filter(Boolean);
  if (parts.length === 0) page = <HomePage go={go} />;
  else if (parts[0] === "resume") page = <ResumePage />;
  else if (parts[0] === "notes" && parts.length === 1) page = <NotesPage go={go} />;
  else if (parts[0] === "notes" && parts[1]) page = <NotePage id={parts[1]} go={go} />;
  else if (parts[0] === "about") page = <AboutPage go={go} />;
  else if (parts[0] === "tag" && parts[1]) page = <TagPage tag={decodeURIComponent(parts[1])} go={go} />;
  else if (parts[0] === "search") page = <SearchPage go={go} />;
  else if (parts[0] === "design-system") page = <DesignSystemPage go={go} />;
  else page = <NotFoundPage go={go} route={route} />;

  return (
    <>
      <Layout route={route} go={go}>{page}</Layout>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mood">
          <TweakRadio label="Style"
            value={t.mood}
            options={["terminal", "minimal"]}
            onChange={(v) => setTweak("mood", v)} />
        </TweakSection>

        <TweakSection label="Theme">
          <TweakRadio label="Mode"
            value={t.theme}
            options={["light", "dark"]}
            onChange={(v) => setTweak("theme", v)} />
        </TweakSection>

        <TweakSection label="Accent">
          <TweakRadio label="Color"
            value={t.accent}
            options={["wine", "olive", "indigo", "rust"]}
            onChange={(v) => setTweak("accent", v)} />
        </TweakSection>

        <TweakSection label="Jump to">
          {[
            ["Home", "/"], ["Resume", "/resume"], ["Notes", "/notes"],
            ["Note detail", "/notes/claude-md-as-context"], ["About", "/about"],
            ["Tag · AI", "/tag/AI"], ["Search", "/search"], ["404", "/nope"],
            ["Design System", "/design-system"],
          ].map(([l, p]) => (
            <TweakButton key={p} label={l} onClick={() => go(p)} />
          ))}
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
