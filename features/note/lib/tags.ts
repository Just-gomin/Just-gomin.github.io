/**
 * 태그 필터의 선택 상태는 URL 쿼리 문자열 `?tags=a,b`에 둔다.
 * 이 파일의 함수는 쿼리 문자열과 노트 목록만 다루는 순수 함수다.
 */
export const TAGS_QUERY_KEY = "tags";

/**
 * `tags` 쿼리 값을 선택된 태그 목록으로 바꾼다. 빈 값과 중복은 버린다.
 */
export function parseSelectedTags(value: string | null | undefined): string[] {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
  return [...new Set(tags)];
}

/**
 * 선택된 태그 목록을 쿼리 문자열로 바꾼다. 선택이 없으면 빈 문자열을 돌려준다.
 */
export function toTagsQuery(selectedTags: string[]): string {
  if (selectedTags.length === 0) return "";
  return `?${TAGS_QUERY_KEY}=${selectedTags.map(encodeURIComponent).join(",")}`;
}

/**
 * 태그가 선택돼 있으면 빼고, 아니면 더한 새 목록을 돌려준다.
 */
export function toggleTag(selectedTags: string[], tag: string): string[] {
  return selectedTags.includes(tag)
    ? selectedTags.filter((selected) => selected !== tag)
    : [...selectedTags, tag];
}

/**
 * 선택된 태그 중 하나라도 가진 노트만 남긴다(OR). 선택이 없으면 전체를 돌려준다.
 */
export function filterNotesByTags<T extends { tags: string[] }>(
  noteList: T[],
  selectedTags: string[],
): T[] {
  if (selectedTags.length === 0) return noteList;
  return noteList.filter((note) =>
    note.tags.some((tag) => selectedTags.includes(tag)),
  );
}
