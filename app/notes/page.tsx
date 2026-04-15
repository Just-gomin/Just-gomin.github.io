import { getAllNotes } from "@/features/note";
import { TagFilter } from "@/features/note/components";
import { format } from "date-fns";
import Link from "next/link";

export default function Notes() {
  const noteList = getAllNotes();
  const tags = new Set<string>();
  noteList.map((note) => note.tags.map((tag) => tags.add(tag)));

  return (
    <div className="flex flex-row gap-12">
      <TagFilter tags={[...tags]} />
      <div>
        {noteList.map((note) => (
          <Link key={note.slug} href={`/notes/${note.slug}`}>
            <p>
              {note.title} | {format(note.date, "yyyy-MM-dd")} |{" "}
              {note.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
