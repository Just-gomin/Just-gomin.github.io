import { getAllNotes } from "@/features/note";
import { format } from "date-fns";
import Link from "next/link";

export default function Notes() {
  const noteList = getAllNotes();

  return (
    <div>
      <Link href="/">/</Link>
      <p>This is Notes page.</p>
      <br />
      {noteList.map((note) => (
        <Link key={note.slug} href={`/notes/${note.slug}`}>
          <p>
            {note.title} | {format(note.date, "yyyy-MM-dd")} |{" "}
            {note.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
