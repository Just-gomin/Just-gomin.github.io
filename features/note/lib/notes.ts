import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compareDesc, parseISO } from "date-fns";
import { Note, NoteMeta } from "../types.js";

const NOTES_DIR = join(process.cwd(), "content", "notes");

/**
 * NOTES_DIR 하위의 디렉토리명을 slug 목록으로 반환한다.
 *
 * @returns slug 배열. NOTES_DIR이 존재하지 않으면 빈 배열.
 */
function getNoteSlugs(): string[] {
  try {
    const direntList = readdirSync(NOTES_DIR, { withFileTypes: true });
    const slugList: string[] = direntList
      .filter((dirent) => dirent.isDirectory())
      .map((directory) => directory.name);

    return slugList;
  } catch (e) {
    console.error(`Exception occurred on getNoteSlugs()\nmessage: ${e}`);
  }

  return [];
}

/**
 * 지정된 slug의 meta.json을 읽어 {@link NoteMeta}로 반환한다.
 *
 * @param slug - 노트 디렉토리명
 * @returns 노트 메타데이터
 * @throws 파일이 없거나 JSON 파싱에 실패한 경우
 */
function getNoteMeta(slug: string): NoteMeta {
  const slugPath = join(NOTES_DIR, slug, "meta.json");
  const metaFile = readFileSync(slugPath, { encoding: "utf-8" });
  const metaData: NoteMeta = JSON.parse(metaFile);

  if (isNaN(Date.parse(metaData.date))) {
    console.error(
      `Note's date is not valid. slug: ${slug}, date: ${metaData.date}`,
    );
  }

  return metaData;
}

/**
 * 지정된 slug의 index.mdx 원본 문자열을 반환한다.
 *
 * @param slug - 노트 디렉토리명
 * @returns MDX 원본 문자열
 * @throws 파일이 존재하지 않는 경우
 */
function getNoteContent(slug: string): string {
  const contentPath = join(NOTES_DIR, slug, "index.mdx");
  const contentFile = readFileSync(contentPath, { encoding: "utf-8" });

  return contentFile;
}

/**
 * 메타데이터와 본문을 조합하여 하나의 {@link Note}를 반환한다.
 *
 * @param slug - 노트 디렉토리명
 * @returns slug, 메타데이터, 본문이 포함된 Note 객체
 */
export function getNote(slug: string): Note {
  const metaData = getNoteMeta(slug);
  const content = getNoteContent(slug);
  const note = { ...metaData, slug, content };

  return note;
}

/**
 * 전체 노트를 날짜 내림차순(최신순)으로 정렬하여 반환한다.
 *
 * @returns 날짜 내림차순으로 정렬된 Note 배열
 */
export function getAllNotes(): Note[] {
  const slugList = getNoteSlugs();
  const noteList: Note[] = slugList
    .map(getNote)
    .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));

  return noteList;
}

/**
 * Next.js generateStaticParams용 slug 객체 배열을 반환한다.
 *
 * @returns `{ slug }` 객체 배열
 */
export function generateNoteStaticParams(): { slug: string }[] {
  const slugList = getNoteSlugs();
  return slugList.map((slug) => ({ slug }));
}
