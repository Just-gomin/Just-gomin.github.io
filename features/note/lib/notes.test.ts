import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NoteMeta } from "../types.js";

let rootDir: string;

/**
 * 임시 루트의 content/notes/<slug>/ 아래에 meta.json과 index.mdx를 만든다.
 */
function writeNote(slug: string, meta: NoteMeta, content = `# ${slug}`) {
  const noteDir = join(rootDir, "content", "notes", slug);
  mkdirSync(noteDir, { recursive: true });
  writeFileSync(join(noteDir, "meta.json"), JSON.stringify(meta));
  writeFileSync(join(noteDir, "index.mdx"), content);
}

function meta(date: string): NoteMeta {
  return { title: "title", date, description: "description", tags: [] };
}

/**
 * notes.ts는 import 시점에 process.cwd()로 NOTES_DIR을 정하므로,
 * cwd를 임시 루트로 바꾼 뒤 모듈을 새로 불러온다.
 */
async function loadNotes() {
  vi.spyOn(process, "cwd").mockReturnValue(rootDir);
  vi.resetModules();
  return import("./notes.js");
}

beforeEach(() => {
  rootDir = mkdtempSync(join(tmpdir(), "notes-test-"));
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(rootDir, { recursive: true, force: true });
});

describe("getAllNotes", () => {
  it("노트를 날짜 내림차순으로 돌려준다", async () => {
    writeNote("old", meta("2024-01-01"));
    writeNote("new", meta("2026-03-15"));
    writeNote("mid", meta("2025-07-10"));

    const { getAllNotes } = await loadNotes();

    expect(getAllNotes().map((note) => note.slug)).toEqual([
      "new",
      "mid",
      "old",
    ]);
  });

  it("날짜가 유효하지 않은 노트가 있으면 slug를 담은 오류를 던진다", async () => {
    writeNote("valid", meta("2026-01-01"));
    writeNote("broken", meta("not-a-date"));

    const { getAllNotes } = await loadNotes();

    expect(() => getAllNotes()).toThrow(/slug: broken, date: not-a-date/);
  });
});

describe("getNote", () => {
  it("메타데이터와 본문, slug를 합쳐 돌려준다", async () => {
    writeNote("hello", meta("2026-01-01"), "# Hello");

    const { getNote } = await loadNotes();

    expect(getNote("hello")).toEqual({
      ...meta("2026-01-01"),
      slug: "hello",
      content: "# Hello",
    });
  });
});
