# Just-gomin.github.io 기획서

## 1. 프로젝트 개요

### 1.1 배경

작성자(Just-gomin)는 모바일(Flutter) 중심으로 커리어를 쌓아온 개발자로, 웹 프론트엔드(React/Next.js) 실무 감각을 확보해 기술 스택 의존도를 분산시키고자 한다. 동시에 개인 글쓰기와 이력 정보를 한 공간에 모아두고, 자체 콘텐츠 파이프라인을 직접 운영해 본다는 학습 경험을 얻고자 한다. 외부 블로그 플랫폼 대신 GitHub Pages 위에 정적 사이트를 직접 구축하는 방식을 선택해, 인프라부터 디자인까지 전 구간을 스스로 통제한다.

이 기획서는 두 개의 1차 진실 소스를 갖는다.

- `plans/PLAN.md` — 프로젝트 목적·기술 스택·단계별 개발 흐름
- `plans/designs/just-gomin-blog-design-guide/project/` — 색상 토큰, 컴포넌트 명세, 페이지 레이아웃, 디자인 원칙

후자(디자인 시안 프로젝트)는 단순 시안이 아니라 실행 가능한 React 프로토타입(`app.jsx`, `pages.jsx`), 1612줄의 토큰/스타일(`styles.css`), 17개 공통 컴포넌트(`components.jsx`), 도메인 데이터 스키마(`data.jsx`), 6개 디자인 원칙(`design-system.jsx`)으로 구성된 완성 단계의 디자인 시스템 정의이다. 코드 작업 중 시안과 본 기획서가 어긋날 경우 시안이 우선한다.

### 1.2 해결하려는 문제

- 글쓰기 도구와 이력서가 외부 플랫폼에 흩어져 있어 일관된 톤·디자인으로 묶이지 않는다.
- 기존 블로그 플랫폼은 마크다운 확장(코드 블록 컴포넌트, 콜아웃, 토글 등)에서 한계가 있고, 디자인 토큰 단위로 톤을 잡기 어렵다.
- React/Next.js를 학습 자료가 아닌 **운영되는 산출물** 위에서 손에 익혀야 하는데, 적합한 실습 무대가 없다.

## 2. 프로젝트 목표 및 범위

### 2.1 목표

- Next.js 16 App Router · MDX · Tailwind CSS · GitHub Actions를 직접 운영해 본다.
- "글쓰기 → 빌드 → 배포"까지의 사이클을 자동화해 글 한 편을 30분 안에 발행할 수 있게 한다.
- 미니멀 타이포그래피 중심의 일관된 톤(크림 화이트 / 웜 브라운, NanumGothicCoding, 올리브 액센트)을 유지한다.

### 2.2 MVP 범위

페이지 (6종)

- `/` — 홈 (Typewriter 슬로건 3개)
- `/notes` — 노트 목록 (좌측 태그 필터 + 우측 노트 테이블)
- `/notes/[slug]` — 노트 상세 (3단 그리드: 좌 메타 sticky / 중앙 640px 본문 / 우 TOC sticky)
- `/resume` — 이력서
- `/search` — 검색 (grep prompt + 클라이언트 사이드 전문 검색)
- `/not-found` — 404

기능 / 시스템

- MDX 기반 노트 작성 흐름과 메타데이터(`meta.json`) 관리
- shiki 기반 코드 블록 하이라이팅
- 디자인 토큰(라이트 모드 단일, 올리브 액센트 고정) 및 17개 공통 컴포넌트 세트
- 검색엔진 노출용 SEO 메타(generateMetadata, JSON-LD, sitemap, robots)
- GitHub Actions 자동 빌드·배포

MVP 제외 (향후 확장으로 분리)

- 다크 모드, 액센트 스위칭, 터미널/미니멀 모드 토글
- 추가 페이지: `/about`, `/tag/[tag]`, `/design-system`
- giscus 댓글, RSS 피드, OG Image 자동 생성, View Transitions, Jest

### 2.3 성공 지표

- 노트 1편 작성 → PR → main 머지 → GitHub Pages 배포까지 30분 이내.
- `pnpm build` 후 Lighthouse Performance / Accessibility / SEO 각 90 이상.
- Google Rich Results Test에서 `BlogPosting` JSON-LD 인식 성공.
- 6개월간 노트 6편 이상 발행.

## 3. 타겟 사용자

### 3.1 주요 사용자층

- **운영자 본인(Just-gomin)** — 글을 쓰고, 이력서를 갱신하고, 컴포넌트를 추가하는 1차 사용자.
- **잠재 채용 담당자 / 동료 개발자** — Resume 페이지와 Notes를 통해 작성자의 사고 방식과 작업 결과물을 확인하는 2차 사용자.

### 3.2 사용자 니즈

- 운영자: "복잡한 CMS 없이 마크다운 한 편 추가로 글이 배포되어야 한다."
- 방문자: "글이 빠르게 열리고, 코드 블록이 읽기 좋고, 모바일에서도 읽기 흐름이 끊기지 않아야 한다."

## 4. 핵심 기능 명세

### 4.1 필수 기능 (MVP)

- 홈 페이지 — `SLOGANS` 3개를 `Typewriter`로 순차 표시, 한글 번역 fade-in
- Notes 목록 — `WHEN & WHERE` 컬럼(`yyyy.MM.dd` 포맷 + `@HOME` 형태의 `where?`), 태그 클릭 필터, 검색
- Note 상세 — MDX 본문 640px, 좌측 메타 sticky 패널, 우측 TOC sticky (스크롤 스파이), 모바일에서는 inline `<details>` TOC
- Resume 페이지 — 6컬럼 프로필 그리드, 경력 카드(역할/기간 · 업무 항목), 연락처
- Search 페이지 — `grep` prompt 검색창, 제목/요약/태그 전문 검색, 빈 상태에서 인기 태그 노출
- 디자인 시스템 — CSS 변수 토큰, NanumGothicCoding 폰트, 17개 공통 컴포넌트, MDX 컴포넌트 매핑
- SEO — 페이지별 metadata, `BlogPosting` JSON-LD, sitemap.xml, robots.txt, OG 메타
- 자동 배포 — `ci.yml`(PR 빌드 검증), `deploy.yml`(main → GitHub Pages), `claude-review.yml`(PR 자동 리뷰)

### 4.2 향후 확장 가능 기능

| 기능                    | 비고                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| 다크 모드               | `next-themes` + `--c-*` 다크 토큰 추가 (`--c-accent` 갈아끼우기) |
| 액센트 스위칭           | wine / olive / indigo / rust 4종 (`[data-accent="..."]`)         |
| 터미널 / 미니멀 모드    | 시안의 두 가지 무드 토글                                         |
| `/about` 페이지         | 자기소개 + interests + tools 그리드                              |
| `/tag/[tag]` 페이지     | 태그 단독 라우트 (현재는 `/notes` 내 필터로 대체)                |
| `/design-system` 페이지 | 토큰/컴포넌트 레퍼런스 (개발자 전용으로만 활용 가능)             |
| giscus 댓글             | GitHub Discussions 연동                                          |
| RSS 피드                | `feed` 패키지                                                    |
| OG Image 자동 생성      | `@vercel/og` + `satori`                                          |
| View Transitions        | React 19.2 내장                                                  |
| 유닛 테스트             | `Jest` + `ts-jest` (`features/note/lib/notes.ts` 중심)           |

## 5. 기술 스택 및 아키텍처

### 5.1 기술 스택

| 영역            | 기술                           |
| --------------- | ------------------------------ |
| 프레임워크      | Next.js 16 (App Router)        |
| 런타임 / UI     | React 19.2                     |
| 번들러          | Turbopack (Next.js 16 기본)    |
| 언어            | TypeScript                     |
| 패키지 매니저   | pnpm                           |
| 스타일링        | Tailwind CSS + CSS 변수 토큰   |
| 폰트            | NanumGothicCoding (`--f-mono`) |
| 콘텐츠          | `@next/mdx` + `meta.json`      |
| 코드 하이라이팅 | shiki                          |
| 날짜            | date-fns (`yyyy.MM.dd` 포맷)   |
| Lint / Format   | ESLint + Prettier              |
| Git Hook        | husky + lint-staged            |
| 배포            | GitHub Actions → GitHub Pages  |

### 5.2 아키텍처 개요

- **정적 사이트 출력**(`output: 'export'`) — Next.js 빌드 결과를 `out/`에 정적 파일로 출력, GitHub Pages가 서빙.
- **thin shell `app/` + 도메인 모듈 `features/`** — 라우팅 진입점은 얇게, 실제 로직은 `features/{note,resume,common}` 하위에 응집.
- **콘텐츠 분리** — MDX 본문은 `content/notes/{slug}/index.mdx`, 메타는 `meta.json`, 이미지는 `public/notes/{slug}/images/`.
- **토큰 단일화** — 모든 색상은 `--c-*` CSS 변수, 모든 폰트는 `--f-mono`. Tailwind는 토큰을 색상 매핑으로만 사용.

### 5.3 기술 선택 이유 / 디자인 원칙

기술 선택 이유

- **Next.js 16 + App Router**: 학습 목표이자 React 19.2 생태계의 표준 흐름.
- **MDX + `meta.json`**: 본문은 컴포넌트 직접 import로 자유롭게 확장, 메타는 파싱 비용 없이 곧바로 사용.
- **Tailwind + CSS 변수**: 향후 다크/액센트 스위칭을 위한 단일 토큰 계층.
- **pnpm**: 의존성 그래프가 평평하지 않아 학습 시 패키지 해석을 명확히 볼 수 있음.

디자인 원칙 (`design-system.jsx` 인용)

1. 모노스페이스 일관성 — 본문, 코드, UI 모두 같은 폰트
2. 그래픽 대신 어휘 — `[x]`, `$`, `//`, `─` 같은 기호로 표현
3. 색은 최소한으로 — 한 가지 포인트 컬러(올리브)로 인터랙션 표현
4. 여백이 곧 디자인 — 4px 그리드, 라인 최소화
5. 읽기 위한 공간 — 본문 폭 640px, 두꺼운 헤딩 위계
6. 커서가 살아 있다 — 미세한 모션으로 페이지가 켜져 있음을 알림

핵심 토큰 (`styles.css`)

- 배경 / 텍스트: `--c-bg: #fbfafa`, `--c-fg: #7c7365`, `--c-fg-strong: #5c5347`, `--c-fg-muted: #b8ae9e`, `--c-fg-faint: #ddd2c2`
- 액센트(올리브 고정): `--c-accent: #5b5c2a`, `--c-accent-soft: #5b5c2a14`
- 폰트: `--f-mono: "NanumGothicCoding", "D2Coding", ...`

## 6. 개발 일정

### 6.1 마일스톤

| 마일스톤                | 목표 시점       | 상태    |
| ----------------------- | --------------- | ------- |
| M1. 뼈대 구축           | 2026-03-14      | 완료    |
| M2. 배포 파이프라인     | 2026-03-27      | 완료    |
| M3. MDX 블로그 핵심     | 2026-03-31      | 완료    |
| M4. 디자인 시스템(테마) | 2026-05-31 목표 | 진행 중 |
| M5. SEO 최적화          | 2026-06-15 목표 | 예정    |
| M6. Resume 페이지       | 2026-06-30 목표 | 예정    |
| M7. Search 페이지       | 2026-07-15 목표 | 예정    |
| M8. 검증 및 운영        | 2026-07-31 목표 | 예정    |

### 6.2 단계별 계획

- **Phase 1 — 뼈대 (완료)**: 홈, 네비, 기본 레이아웃, 전역 Metadata.
- **Phase 2 — 배포 (완료)**: `next.config.ts` 정적 빌드 설정, 3개 GitHub Actions 워크플로우.
- **Phase 3 — MDX 코어 (완료)**: 노트 타입(`features/note/types.ts`의 `NoteMeta { title, date, where?, description, tags }`), 목록/상세, `generateStaticParams`, shiki.
- **Phase 4 — 디자인 시스템 (진행 중)**: 라이트 토큰 정의, NanumGothicCoding 폰트, 17개 공통 컴포넌트, MDX 컴포넌트 매핑, 노트 목록/상세 재구성, 반응형 720px / 420px.
- **Phase 5 — SEO**: `generateMetadata`, `BlogPosting` JSON-LD, `sitemap.ts`, `robots.ts`, OG / Twitter Card.
- **Phase 6 — Resume**: 프로필 그리드, 경력 카드, 연락처, `ProfilePage` JSON-LD.
- **Phase 7 — Search**: 클라이언트 사이드 전문 검색, 키보드 단축키(`/`), 인기 태그.
- **Phase 8 — 검증 및 운영**: Lighthouse, Rich Results Test, 첫 노트 발행 사이클 측정.

## 7. MVP 검증 계획

### 7.1 검증 가설

- **H1.** "마크다운 한 편 추가로 글이 배포된다"는 흐름이 30분 이내에 가능하다면, 실제 작성 빈도가 유지된다.
- **H2.** 미니멀 타이포그래피와 일관된 디자인 토큰만으로도 방문자에게 '읽고 싶은 페이지'로 인지된다.
- **H3.** Next.js 정적 빌드 + GitHub Pages 조합은 개인 블로그 운영에 충분한 성능/SEO를 제공한다.

### 7.2 검증 방법

- 노트 발행 사이클 측정: PR 생성 → 머지 → 배포 완료까지 소요 시간을 기록.
- Lighthouse / Google Rich Results Test로 성능·SEO 측정.
- 외부 독자 5명에게 Resume + Note 2편을 보여주고 "다시 읽고 싶다"는 응답 비율 수집.

### 7.3 의사결정 기준

- 6개월간 노트 ≥ 6편 + Lighthouse 90+ + JSON-LD 인식 성공 시 MVP 검증 완료.
- 노트 ≤ 2편이면 "쓰기 진입 비용이 여전히 높다"로 판단하고 작성 흐름을 우선 재설계.

## 8. 리스크 및 대응 방안

| 리스크                               | 영향 | 대응                                                                          |
| ------------------------------------ | ---- | ----------------------------------------------------------------------------- |
| Next.js 16 정적 export 제약          | 중   | 동적 라우팅은 `generateStaticParams`로 사전 생성                              |
| MDX 컴포넌트 비대화 → 학습 비용 증가 | 중   | `features/note/components/`에 좁게 응집, 공통 UI는 `features/common`으로 분리 |
| 디자인 시스템 작업 장기화            | 높음 | 시안과 동일한 컴포넌트 단위로 PR 분할, 각 PR 머지 후 노트 1편 작성            |
| 시안과 코드 사이의 디자인 드리프트   | 중   | 시안을 1차 진실 소스로 못박고, 컴포넌트 PR 본문에 시안 파일 라인 인용 의무화  |
| GitHub Pages 캐시로 인한 배포 미반영 | 낮음 | `trailingSlash: true` + `.nojekyll`, 배포 후 강제 새로고침 절차 문서화        |

## 업데이트 이력

| 날짜       | 버전 | 변경 내용                             |
| ---------- | ---- | ------------------------------------- |
| 2026-05-17 | v1.0 | 최초 작성(PLAN.md + 디자인 시안 반영) |
