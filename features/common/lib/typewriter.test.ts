import { describe, expect, it } from "vitest";
import { totalLength, visibleSegments } from "./typewriter.js";

const segments = [
  { text: "Working at " },
  { text: "beyo", href: "https://example.com", external: true },
  { text: " now." },
];

describe("visibleSegments", () => {
  it("앞에서부터 센 글자 수만큼만 조각을 남긴다", () => {
    expect(visibleSegments(segments, 13)).toEqual([
      { text: "Working at " },
      { text: "be", href: "https://example.com", external: true },
    ]);
  });

  it("0글자면 빈 목록이고, 전체보다 많으면 모든 조각을 그대로 둔다", () => {
    expect(visibleSegments(segments, 0)).toEqual([]);
    expect(visibleSegments(segments, 100)).toEqual(segments);
  });

  it("빈 조각은 남기지 않는다", () => {
    expect(visibleSegments([{ text: "" }, { text: "ab" }], 1)).toEqual([
      { text: "a" },
    ]);
  });
});

describe("totalLength", () => {
  it("조각들의 글자 수를 더한다", () => {
    expect(totalLength(segments)).toBe(20);
  });
});
