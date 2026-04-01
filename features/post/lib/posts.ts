import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compareDesc, parseISO } from "date-fns";
import { Post, PostMeta } from "../types.js";

const POSTS_DIR = join(process.cwd(), "content", "posts");

/**
 * POSTS_DIR 하위의 디렉토리명을 slug 목록으로 반환한다.
 *
 * @returns slug 배열. POSTS_DIR이 존재하지 않으면 빈 배열.
 */
function getPostSlugs(): string[] {
  try {
    const direntList = readdirSync(POSTS_DIR, { withFileTypes: true });
    const slugList: string[] = direntList
      .filter((dirent) => dirent.isDirectory())
      .map((directory) => directory.name);

    return slugList;
  } catch (e) {
    console.error(`Exception occurred on getPostSlugs()\nmessage: ${e}`);
  }

  return [];
}

/**
 * 지정된 slug의 meta.json을 읽어 {@link PostMeta}로 반환한다.
 *
 * @param slug - 포스트 디렉토리명
 * @returns 포스트 메타데이터
 * @throws 파일이 없거나 JSON 파싱에 실패한 경우
 */
function getPostMeta(slug: string): PostMeta {
  const slugPath = join(POSTS_DIR, slug, "meta.json");
  const metaFile = readFileSync(slugPath, { encoding: "utf-8" });
  const metaData: PostMeta = JSON.parse(metaFile);

  if (isNaN(Date.parse(metaData.date))) {
    console.error(
      `Post's date is not valid. slug: ${slug}, date: ${metaData.date}`,
    );
  }

  return metaData;
}

/**
 * 지정된 slug의 index.mdx 원본 문자열을 반환한다.
 *
 * @param slug - 포스트 디렉토리명
 * @returns MDX 원본 문자열
 * @throws 파일이 존재하지 않는 경우
 */
function getPostContent(slug: string): string {
  const contentPath = join(POSTS_DIR, slug, "index.mdx");
  const contentFile = readFileSync(contentPath, { encoding: "utf-8" });

  return contentFile;
}

/**
 * 메타데이터와 본문을 조합하여 하나의 {@link Post}를 반환한다.
 *
 * @param slug - 포스트 디렉토리명
 * @returns slug, 메타데이터, 본문이 포함된 Post 객체
 */
export function getPost(slug: string): Post {
  const metaData = getPostMeta(slug);
  const content = getPostContent(slug);
  const post = { ...metaData, slug, content };

  return post;
}

/**
 * 전체 포스트를 날짜 내림차순(최신순)으로 정렬하여 반환한다.
 *
 * @returns 날짜 내림차순으로 정렬된 Post 배열
 */
export function getAllPosts(): Post[] {
  const slugList = getPostSlugs();
  const postList: Post[] = slugList
    .map(getPost)
    .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));

  return postList;
}

/**
 * Next.js generateStaticParams용 slug 객체 배열을 반환한다.
 *
 * @returns `{ slug }` 객체 배열
 */
export function generatePostStaticParams(): { slug: string }[] {
  const slugList = getPostSlugs();
  return slugList.map((slug) => ({ slug }));
}
