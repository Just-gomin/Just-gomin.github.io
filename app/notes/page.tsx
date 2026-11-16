import { Suspense } from "react";
import { getAllNotes, NoteSummary } from "@/features/note";
import { NoteBrowser, TagFilter } from "@/features/note/components";
import { NoteList } from "@/features/note/components/NoteList";

export default function Notes() {
  const noteList: NoteSummary[] = getAllNotes().map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ content, ...summary }) => summary,
  );
  const tags = new Set<string>();
  noteList.map((note) => note.tags.map((tag) => tags.add(tag)));

  // 정적 내보내기에서는 쿼리 문자열을 빌드 때 알 수 없으므로,
  // 미리 렌더링한 HTML에는 필터 없는 목록을 두고 클라이언트에서 쿼리를 읽어 바꾼다.
  const fallback = (
    <div className="flex flex-row gap-4">
      <TagFilter tags={[...tags]} selectedTags={[]} />
      <NoteList noteList={noteList} />
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      <NoteBrowser noteList={noteList} tags={[...tags]} />
    </Suspense>
  );
}
