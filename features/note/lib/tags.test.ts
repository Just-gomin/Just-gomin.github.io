import { describe, expect, it } from "vitest";
import {
  filterNotesByTags,
  parseSelectedTags,
  toggleTag,
  toTagsQuery,
} from "./tags.js";

const noteList = [
  { slug: "react", tags: ["react", "frontend"] },
  { slug: "next", tags: ["next", "frontend"] },
  { slug: "rust", tags: ["rust"] },
  { slug: "untagged", tags: [] },
];

describe("parseSelectedTags", () => {
  it("쿼리 값이 없으면 빈 목록을 돌려준다", () => {
    expect(parseSelectedTags(null)).toEqual([]);
    expect(parseSelectedTags("")).toEqual([]);
  });

  it("쉼표로 나누고 빈 값과 중복을 버린다", () => {
    expect(parseSelectedTags("react, next,,react")).toEqual(["react", "next"]);
  });
});

describe("toTagsQuery", () => {
  it("선택이 없으면 빈 문자열을 돌려준다", () => {
    expect(toTagsQuery([])).toBe("");
  });

  it("태그를 인코딩해 쉼표로 잇는다", () => {
    expect(toTagsQuery(["react", "한글 태그"])).toBe(
      "?tags=react,%ED%95%9C%EA%B8%80%20%ED%83%9C%EA%B7%B8",
    );
  });

  it("만든 쿼리를 다시 읽으면 같은 목록이 된다", () => {
    const query = toTagsQuery(["react", "한글 태그"]);
    const value = new URLSearchParams(query).get("tags");
    expect(parseSelectedTags(value)).toEqual(["react", "한글 태그"]);
  });
});

describe("toggleTag", () => {
  it("선택되지 않은 태그는 더한다", () => {
    expect(toggleTag(["react"], "next")).toEqual(["react", "next"]);
  });

  it("선택된 태그는 뺀다", () => {
    expect(toggleTag(["react", "next"], "react")).toEqual(["next"]);
  });
});

describe("filterNotesByTags", () => {
  it("선택이 없으면 모든 노트를 돌려준다", () => {
    expect(filterNotesByTags(noteList, [])).toEqual(noteList);
  });

  it("선택한 태그 중 하나라도 가진 노트를 남긴다", () => {
    const slugs = filterNotesByTags(noteList, ["react", "rust"]).map(
      (note) => note.slug,
    );
    expect(slugs).toEqual(["react", "rust"]);
  });

  it("어느 노트에도 없는 태그만 고르면 빈 목록을 돌려준다", () => {
    expect(filterNotesByTags(noteList, ["unknown"])).toEqual([]);
  });
});
