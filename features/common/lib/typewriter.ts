/** 타이핑할 글의 한 조각. `href`가 있으면 링크입니다. */
export type Segment = {
  text: string;
  href?: string;
  /** 새 탭으로 엽니다. */
  external?: boolean;
};

/** 조각들의 글자 수 합. */
export function totalLength(segments: Segment[]): number {
  return segments.reduce((sum, segment) => sum + segment.text.length, 0);
}

/**
 * 앞에서부터 `count`글자만 보이도록 조각을 자릅니다.
 * 아직 한 글자도 보이지 않는 조각은 뺍니다.
 */
export function visibleSegments(segments: Segment[], count: number): Segment[] {
  const visible: Segment[] = [];
  let remaining = Math.max(0, count);
  for (const segment of segments) {
    if (remaining === 0) break;
    const take = Math.min(segment.text.length, remaining);
    remaining -= take;
    if (take > 0)
      visible.push({ ...segment, text: segment.text.slice(0, take) });
  }
  return visible;
}
