import { getAllNotes } from "@/features/note";
import { TagFilter } from "@/features/note/components";
import { NoteList } from "@/features/note/components/NoteList";

export default function Notes() {
  const noteList = getAllNotes();
  const tags = new Set<string>();
  noteList.map((note) => note.tags.map((tag) => tags.add(tag)));

  return (
    <div className="flex flex-row gap-4">
      <TagFilter tags={[...tags]} />
      <NoteList noteList={noteList} />
    </div>
  );
}
