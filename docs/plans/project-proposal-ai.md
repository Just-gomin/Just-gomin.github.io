# Just-gomin.github.io — AI Agent 기획서

## 1. 프로젝트 개요

- **목적**: Next.js 16 + MDX 기반 개인 블로그(Notes / Resume / Search) 구축, GitHub Pages 자동 배포.
- **디자인 톤**: 미니멀 모노스페이스 타이포그래피, NanumGothicCoding, 크림 화이트 / 웜 브라운 / 올리브 액센트(고정).
- **운영 모델**: 정적 사이트(`output: 'export'`) + GitHub Actions CI/CD + PR 단위 Claude 리뷰.
- **1차 진실 소스 (Source of Truth)**:
  - 비즈니스 로직 / 일정: `plans/PLAN.md`
  - 디자인 / 컴포넌트 / 토큰: `plans/designs/just-gomin-blog-design-guide/project/`

### 1.1 디자인 시안 파일 인덱스

| 파일                | 역할                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| `styles.css`        | CSS 변수 토큰(라이트/다크/액센트), 반응형 720px/420px                        |
| `components.jsx`    | 17개 공통 컴포넌트 정의                                                      |
| `pages.jsx`         | 페이지별 레이아웃 (HomePage, NotesPage, NotePage, ResumePage, SearchPage 등) |
| `data.jsx`          | 도메인 데이터 스키마 (NOTES, TAGS, CAREER, PROFILE_COLS, SLOGANS)            |
| `design-system.jsx` | 6가지 디자인 원칙                                                            |
| `app.jsx`           | 해시 라우터 + 키보드 단축키 시연 (참고용)                                    |

코드가 시안과 어긋날 경우 시안이 우선한다.

## 2. MVP 범위 및 성공 지표

### 2.1 MVP 범위

페이지 (6종)

- `/` — Typewriter 슬로건 3개 + AsciiDivider
- `/notes` — 좌측 태그 필터 + 우측 노트 테이블 (`WHEN & WHERE` / TITLE / TAGS)
- `/notes/[slug]` — 3단 그리드 (좌 메타 sticky / 중앙 640px 본문 / 우 TOC sticky), 모바일 1단 + inline `<details>` TOC
- `/resume` — 6컬럼 프로필 그리드 + 경력 카드 + 연락처
- `/search` — `grep` prompt 검색창, 클라이언트 사이드 전문 검색
- `/not-found` — ASCII art + 홈/notes/search 링크

시스템

- 라이트 모드 토큰 단일 정의, 올리브 액센트 고정 (`#5b5c2a`)
- 17개 공통 컴포넌트 + MDX 매핑
- SEO: `generateMetadata`, `BlogPosting` JSON-LD, `sitemap.ts`, `robots.ts`, OG / Twitter Card
- 자동 배포: `ci.yml`, `deploy.yml`, `claude-review.yml`

MVP 제외 (Phase 8 백로그)

- 다크 모드 / 액센트 스위칭 / 터미널·미니멀 모드 토글
- `/about`, `/tag/[tag]`, `/design-system` 페이지
- giscus, RSS, OG Image 자동 생성, View Transitions, Jest

### 2.2 성공 지표

- Lighthouse Perf / A11y / SEO ≥ 90
- Google Rich Results: `BlogPosting` 인식 성공
- 노트 발행 사이클(PR → main → Pages) ≤ 30분
- 6개월간 노트 ≥ 6편 발행

## 3. 기술 스택

| 영역        | 기술                           | 버전             | 용도                     |
| ----------- | ------------------------------ | ---------------- | ------------------------ |
| Framework   | Next.js                        | 16 (App Router)  | 라우팅, MDX, 정적 export |
| UI          | React                          | 19.2             | 컴포넌트                 |
| Bundler     | Turbopack                      | Next.js 16 기본  | 빌드/Dev 서버            |
| Language    | TypeScript                     | ≥ 5.x            | 타입 안전성              |
| Pkg Manager | pnpm                           | ≥ 9.x            | 의존성 관리              |
| Styling     | Tailwind CSS                   | ≥ 3.x            | 유틸리티 + CSS 변수 토큰 |
| 폰트        | NanumGothicCoding (`--f-mono`) | next/font/google | 본문/UI/코드 단일 적용   |
| MDX         | @next/mdx + @mdx-js/loader     | latest           | `.mdx` 컴포넌트 import   |
| 코드 HL     | shiki                          | latest           | 코드 블록 하이라이팅     |
| Date        | date-fns                       | latest           | `yyyy.MM.dd` 포맷        |
| Lint        | ESLint + Prettier              | latest           | 코드 스타일              |
| Git Hook    | husky + lint-staged            | latest           | 커밋 전 검사             |
| Deploy      | GitHub Actions → Pages         | —                | 정적 사이트 배포         |

향후(Phase 8)

| 영역      | 기술                | 비고                         |
| --------- | ------------------- | ---------------------------- |
| 테마 토글 | next-themes         | 다크 모드 + 액센트 스위칭    |
| 댓글      | giscus              | GitHub Discussions           |
| RSS       | feed                | RSS 피드 생성                |
| OG 이미지 | @vercel/og + satori | 동적 OG 이미지               |
| 테스트    | Jest + ts-jest      | `features/note/lib/notes.ts` |

## 4. 프로젝트 구조 및 초기화

### 4.1 폴더 구조

```text
Just-gomin.github.io/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── notes/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── resume/page.tsx
│   ├── search/page.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── features/
│   ├── common/
│   │   ├── components/         # Header(+Drawer), Footer, Layout, Cursor, Check, AsciiDivider, Typewriter, Tag, CopyButton, PageTitle, SloganBlock
│   │   ├── constants.ts        # BLOG_TITLE, BLOG_DESCRIPTION, SLOGANS
│   │   └── index.ts
│   ├── note/
│   │   ├── components/         # NoteRow, NotesClient, EmptyState, NoteMetaPanel, TableOfContents, CodeBlock, Callout, Blockquote, Toggle, CheckList, ImagePlaceholder, Embed
│   │   ├── lib/notes.ts
│   │   ├── types.ts            # NoteMeta { title, date, where?, description, tags }
│   │   └── index.ts
│   └── resume/
│       ├── components/         # ResumeProfile, CareerCard
│       ├── data.ts
│       └── index.ts
├── content/
│   └── notes/{slug}/
│       ├── index.mdx
│       └── meta.json           # { title, date(ISO 8601), where?, description, tags }
├── public/
│   ├── notes/{slug}/images/
│   └── .nojekyll
├── mdx-components.tsx
├── next.config.ts
├── postcss.config.mjs           # Tailwind v4 PostCSS 플러그인 (@tailwindcss/postcss)
├── tsconfig.json
└── package.json
```

### 4.2 초기 설정 명령어 (이미 적용됨)

```bash
pnpm create next-app@latest .
pnpm add date-fns shiki @next/mdx @mdx-js/loader
pnpm add -D prettier husky lint-staged @types/mdx
pnpm dlx husky init
touch public/.nojekyll
```

### 4.3 디자인 토큰 (`app/globals.css`)

라이트 모드 단일 정의 (다크 모드 / 액센트 스위칭은 Phase 8).

```css
:root {
  --c-fg: #7c7365;
  --c-fg-strong: #5c5347;
  --c-fg-muted: #b8ae9e;
  --c-fg-faint: #ddd2c2;
  --c-bg: #fbfafa;
  --c-bg-sub: #f6f2ec;
  --c-bg-code: #f2eee9;
  --c-bg-pop: #ffffff;
  --c-stroke: #7c7365;
  --c-stroke-faint: #ddd2c2;
  --c-accent: #5b5c2a;
  --c-accent-soft: #5b5c2a14;
  --f-mono:
    "NanumGothicCoding", "D2Coding", "JetBrains Mono", ui-monospace, monospace;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 5. 핵심 기능 명세 (의존성 포함)

### Feature 1: 디자인 시스템 (선행)

- 우선순위: P0 (모든 P0의 선행)
- 의존성: 없음
- 완료 기준:
  - [ ] `globals.css`에 토큰 정의 (라이트 단일, 올리브 액센트)
  - [ ] `globals.css`의 `@theme inline` 블록에 토큰을 Tailwind 색상/폰트로 매핑 (Tailwind v4 · CSS-first)
  - [ ] `Nanum_Gothic_Coding`을 `--f-mono`에 연결
  - [ ] 17개 컴포넌트 구현 — Cursor, Check, AsciiDivider, Header(+Drawer), Footer, Layout, Typewriter, Tag, CopyButton, PageTitle, CodeBlock, Callout, Toggle, Blockquote, CheckList, ImagePlaceholder, Embed
  - [ ] `mdx-components.tsx`에서 MDX 요소를 위 컴포넌트로 매핑
  - [ ] 반응형 720px / 420px

### Feature 2: 홈 페이지

- 우선순위: P0
- 의존성: F1, `SloganBlock`, `Typewriter`, `AsciiDivider`
- 완료 기준:
  - [ ] 상단 `[ Just-gomin / log / 2026 ]` + AsciiDivider
  - [ ] `SLOGANS` 3개를 `SloganBlock`(Typewriter)으로 순차 표시
  - [ ] 한글 번역 fade-in

### Feature 3: 노트 도메인 (목록)

- 우선순위: P0
- 의존성: F1, `features/note/types.ts`(이미 존재), `Tag`, `NoteRow`, `NotesClient`, `EmptyState`
- 완료 기준:
  - [ ] `/notes`에서 `content/notes/*/meta.json` 전체를 날짜 역순으로 표시
  - [ ] `WHEN & WHERE` 컬럼: `date`를 `date-fns`로 `yyyy.MM.dd` 변환, `where?`는 `@HOME` 형태로 인라인
  - [ ] 좌측 사이드바: `TAGS` 자동 집계 + 클릭 토글 필터
  - [ ] 검색창: 제목/요약/태그 전문 검색

### Feature 4: 노트 상세

- 우선순위: P0
- 의존성: F1, `NoteMetaPanel`, `TableOfContents`, MDX 컴포넌트 세트
- 완료 기준:
  - [ ] `generateStaticParams`로 모든 slug 사전 생성
  - [ ] 3단 그리드 (좌 메타 sticky / 중앙 640px 본문 / 우 TOC sticky)
  - [ ] MDX 헤딩 자동 id + 스크롤 스파이 TOC
  - [ ] 모바일 1단 + inline `<details>` TOC

### Feature 5: Resume

- 우선순위: P0
- 의존성: F1, `ResumeProfile`, `CareerCard`, `features/resume/data.ts`
- 완료 기준:
  - [ ] 6컬럼 프로필 그리드, 멀티라인 값 지원
  - [ ] 경력 카드 (역할/기간 | 업무 항목 박스)
  - [ ] `$ mail → ...`, `$ github → ...` 연락처 섹션
  - [ ] `ProfilePage` JSON-LD

### Feature 6: Search

- 우선순위: P0
- 의존성: F1, F3 (노트 인덱스)
- 완료 기준:
  - [ ] `/` 키 단축키로 검색창 포커스 또는 `/search` 이동
  - [ ] `grep` prompt 인풋 + 제목/요약/태그 전문 검색
  - [ ] 검색 전: 인기 태그 노출, 결과 없음: `EmptyState`

### Feature 7: SEO

- 우선순위: P0
- 의존성: F3, F4, F5
- 완료 기준:
  - [ ] 각 라우트 `generateMetadata` 또는 정적 `metadata`
  - [ ] Note 상세에 `BlogPosting` JSON-LD
  - [ ] `out/sitemap.xml`, `out/robots.txt` 생성
  - [ ] OG / Twitter Card 메타

### Feature 8: 404

- 우선순위: P1
- 의존성: F1
- 완료 기준:
  - [ ] ASCII art + 안내 + 홈/notes/search 링크

### Feature 9: 향후 확장 (P2, Phase 8)

- 다크 모드 토글(`next-themes`) + 다크 토큰 추가
- 액센트 스위칭 + 터미널/미니멀 모드 토글
- `/about`, `/tag/[tag]`, `/design-system` 페이지
- giscus, RSS, OG Image 자동 생성, View Transitions, Jest

## 6. 도메인 데이터 스키마

### 6.1 NoteMeta (`features/note/types.ts` — 변경 없음)

```ts
export type NoteMeta = {
  title: string;
  date: string; // ISO 8601 — UI에서 yyyy.MM.dd로 표시
  where?: string; // "@HOME", "@OFFICE" 등 — 선택적
  description: string;
  tags: string[];
};
export type Note = NoteMeta & {
  slug: string;
  content: string;
  coverImage?: string;
};
```

### 6.2 SLOGANS (`features/common/constants.ts`)

```ts
type Segment = { text: string; href?: string; external?: boolean };
type Slogan = { en: string; ko: string; segments?: Segment[] };
export const SLOGANS: Slogan[] = [
  { en: "Done is better than Perfect", ko: "완벽함보다 완성이 낫습니다" },
  { en: "Read, write, organize.", ko: "읽고, 쓰고, 정리합니다" },
  {
    en: "Working on beyo as Product Engineer now.",
    ko: "지금은 beyo에서 Product Engineer로 일합니다",
    segments: [
      { text: "Working on " },
      { text: "beyo", href: "https://beyo.io", external: true },
      { text: " as " },
      { text: "Product Engineer", href: "/resume" },
      { text: " now." },
    ],
  },
];
```

### 6.3 Resume (`features/resume/data.ts`)

```ts
export type CareerItem = { header: string; lines: string[] };
export type Career = {
  role: string;
  company: string;
  period: string;
  items: CareerItem[];
};
export type ProfileCol = { key: string; val: string };

export const PROFILE_COLS: ProfileCol[] = [
  /* 6개 */
];
export const CAREER: Career[] = [
  /* ... */
];
```

## 7. 개발 Phase별 Task 목록

### Phase 1: 환경 설정 (완료)

- [x] `pnpm create next-app` 초기화
- [x] 의존성 설치
- [x] husky init, `.nojekyll`
- [x] 디렉토리 구조 (`app/`, `features/`, `content/`)

### Phase 2: 배포 파이프라인 (완료)

- [x] `next.config.ts`: `output: 'export'`, `trailingSlash`
- [x] `ci.yml`, `deploy.yml`, `claude-review.yml`
- [x] GitHub Pages Source = GitHub Actions

### Phase 3: MDX 블로그 핵심 (완료)

- [x] `NoteMeta`, `Note` 타입 정의 (`where?` 포함)
- [x] `/notes` 목록, `/notes/[slug]` 상세
- [x] `generateStaticParams`, shiki

### Phase 4: 디자인 시스템 (진행 중)

- [ ] 4-1. `globals.css`에 라이트 토큰 + 올리브 액센트(`#5b5c2a`) 정의 (1h)
- [ ] 4-2. base 스타일 (html/body/a/`::selection`) (1h)
- [ ] 4-3. `globals.css`의 `@theme inline`에 토큰 매핑 (Tailwind v4) (30m)
- [ ] 4-4. `Nanum_Gothic_Coding` 폰트를 `--f-mono`에 연결 (30m)
- [ ] 4-5. `Header.tsx` + Drawer (모바일 햄버거) (4h)
- [ ] 4-6. `Footer.tsx`, `Layout.tsx` (1h)
- [ ] 4-7. `Cursor`, `Check`, `AsciiDivider`, `PageTitle`, `Tag`, `Typewriter` (4h)
- [ ] 4-8. `CodeBlock` + `CopyButton` (shiki 연동) (3h)
- [ ] 4-9. `Callout`, `Blockquote`, `Toggle`, `CheckList`, `ImagePlaceholder`, `Embed` (5h)
- [ ] 4-10. `mdx-components.tsx` 전면 갱신 (1h)
- [ ] 4-11. 홈 페이지 — `SloganBlock` + `SLOGANS` (2h)
- [ ] 4-12. Notes 목록 — `NotesClient`(filter/search), `NoteRow`, `EmptyState`, `WHEN & WHERE` 컬럼 (4h)
- [ ] 4-13. Note 상세 — `NoteMetaPanel`, `TableOfContents`(스크롤 스파이), 모바일 inline TOC (4h)
- [ ] 4-14. `not-found.tsx` (1h)
- [ ] 4-15. 반응형 720px / 420px (3h)

### Phase 5: SEO

- [ ] 5-1. 각 라우트 `metadata` (1h)
- [ ] 5-2. Note 상세 `generateMetadata` (1h)
- [ ] 5-3. `BlogPosting` JSON-LD 주입 (1h)
- [ ] 5-4. `app/sitemap.ts` (1h)
- [ ] 5-5. `app/robots.ts` (30m)
- [ ] 5-6. OG / Twitter Card 메타 (1h)

### Phase 6: Resume

- [ ] 6-1. `features/resume/data.ts` 채우기 (1h)
- [ ] 6-2. `ResumeProfile` 6컬럼 그리드 (2h)
- [ ] 6-3. `CareerCard` (2h)
- [ ] 6-4. 연락처 섹션 + `ProfilePage` JSON-LD (1h)

### Phase 7: Search

- [ ] 7-1. `/search` 페이지 (Client Component) (2h)
- [ ] 7-2. 클라이언트 사이드 전문 검색 (1h)
- [ ] 7-3. 인기 태그 / `EmptyState` (1h)
- [ ] 7-4. `/` 단축키 핸들러 (1h)

### Phase 8: 검증 및 운영

- [ ] 8-1. `pnpm build` → `out/` 검증 (sitemap.xml, robots.txt 포함)
- [ ] 8-2. 로컬 정적 서빙 확인
- [ ] 8-3. main 머지 후 Pages URL 라이브 확인
- [ ] 8-4. Lighthouse Perf/A11y/SEO ≥ 90
- [ ] 8-5. Google Rich Results Test로 `BlogPosting` 인식 확인
- [ ] 8-6. 노트 1편 발행 사이클 ≤ 30분 측정

### Phase 9: 백로그 (Post-MVP)

- [ ] `next-themes` 다크 모드 토글 + `--c-*` 다크 토큰 추가
- [ ] 액센트 스위칭(`[data-accent="..."]`), 터미널/미니멀 모드 토글
- [ ] `/about`, `/tag/[tag]`, `/design-system` 페이지
- [ ] giscus, RSS, OG 이미지, View Transitions, Jest

## 8. MVP 검증 계획

- 가설 H1: 발행 사이클 30분 이내 → 6개월간 노트 ≥ 6편으로 검증
- 가설 H2: 미니멀 디자인 → 외부 독자 5명 중 ≥ 3명이 "다시 읽고 싶다" 응답
- 가설 H3: 정적 빌드 충분성 → Lighthouse 90+ & `BlogPosting` JSON-LD 인식
- 의사결정: 6개월 후 위 지표 미달 시 작성 흐름 / 디자인 / SEO 중 미달 영역만 재설계

## 업데이트 이력

| 날짜       | 버전 | 변경 내용                             |
| ---------- | ---- | ------------------------------------- |
| 2026-05-17 | v1.0 | 최초 작성(PLAN.md + 디자인 시안 반영) |
