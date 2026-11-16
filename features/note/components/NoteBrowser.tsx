"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NoteSummary } from "../types";
import {
  filterNotesByTags,
  parseSelectedTags,
  TAGS_QUERY_KEY,
  toggleTag,
  toTagsQuery,
} from "../lib/tags";
import { NoteList } from "./NoteList";
import { TagFilter } from "./TagFilter";

type Props = {
  noteList: NoteSummary[];
  tags: string[];
};

/**
 * URL의 `?tags=` 쿼리로 노트 목록을 거른다.
 * useSearchParams를 쓰므로 정적 내보내기에서는 Suspense 안에서 렌더링해야 한다.
 */
export function NoteBrowser({ noteList, tags }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTags = parseSelectedTags(searchParams.get(TAGS_QUERY_KEY));

  const push = (nextTags: string[]) => {
    router.push(`${pathname}${toTagsQuery(nextTags)}`, { scroll: false });
  };

  return (
    <div className="flex flex-row gap-4">
      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        onToggle={(tag) => push(toggleTag(selectedTags, tag))}
        onClear={() => push([])}
      />
      <NoteList noteList={filterNotesByTags(noteList, selectedTags)} />
    </div>
  );
}
