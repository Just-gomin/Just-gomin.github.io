export type PostMeta = {
  title: string;
  date: string; // ISO 8601 형식의 날짜 문자열
  description: string;
  tags: string[];
};

export type Post = PostMeta & {
  slug: string; // URL 경로에 사용되는 고유 식별자
  content: string; // 포스트의 본문 내용 (마크다운 형식)
  coverImage?: string; // 포스트의 대표 이미지 URL
};
