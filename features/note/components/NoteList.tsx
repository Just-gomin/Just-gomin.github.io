import Link from "next/link";
import { Note } from "../types";
import { format } from "date-fns";

type Props = {
  noteList: Note[];
};

export function NoteList({ noteList }: Props) {
  return (
    <div className="flex flex-col gap-4" style={{ width: "100%" }}>
      <div
        className="flex flex-row items-baseline-last gap-4 border-b"
        style={{ height: "44px", paddingBottom: "8px" }}
      >
        <p
          style={{ width: "180px" }}
          className="text-(length:--font-size-subheading) font-bold"
        >
          WHEN & WHERE
        </p>
        <p className="text-(length:--font-size-subheading) font-bold">TITLE</p>
      </div>
      <div className="flex flex-col gap-2">
        {noteList.map((note) => (
          <Link key={note.slug} href={`/notes/${note.slug}`}>
            <div className="flex flex-row gap-4">
              <p style={{ width: "180px" }}>
                {format(note.date, "yyyy-MM-dd")}
                <br />
                {note.where ? `@${note.where}` : ""}
              </p>
              <p>
                {note.title} |{note.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
