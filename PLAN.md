# Just-gomin.github.io Plan

Just-gomin의 블로그 프로젝트에 대한 계획 문서.

## 📌 목적

- Next.js + TypeScript 기반 개인 블로그 구축
- React/Next.js 실무 감각 습득 (Flutter 의존도 분산 목적)
- MDX로 포스트 작성, Resume 페이지 포함
- GitHub Actions를 통한 자동 배포 파이프라인 구성

## 📌 블로그 컨셉

- 배경: `#FAF5EE` (크림 화이트), 텍스트: `#354F3B` (딥 그린)
- 폰트: `Nanum Gothic Coding` 전체 적용 (헤더, 본문, 코드 블록 포함)
- 미니멀 디자인 지향: 장식 없는 타이포그래피 중심, 여백과 계층으로 구조 표현

### 👉 레퍼런스

- [zerolog](https://zerolog.vercel.app)

## 📌 기술 스택

| 역할            | 패키지                        | 비고                                 |
| :-------------- | :---------------------------- | :----------------------------------- |
| Framework       | `Next.js 16` (App Router)     | Turbopack 기본 번들러, React 19.2    |
| Language        | `TypeScript`                  |                                      |
| Package Manager | `pnpm`                        |                                      |
| Styling         | `Tailwind CSS`                |                                      |
| MDX             | `@next/mdx`                   | `.mdx` → React 컴포넌트 직접 import  |
| 메타데이터      | 포스트별 `.json` 파일         | 의존성 최소화 및 파싱 과정 생략 목적 |
| 문법 하이라이팅 | `shiki`                       |                                      |
| 날짜 처리       | `date-fns`                    |                                      |
| 댓글            | `giscus`                      | 7단계 이후 추가                      |
| Linting         | `ESLint` + `Prettier`         |                                      |
| Git hook        | `husky` + `lint-staged`       |                                      |
| 테스트          | `Jest`                        | 7단계 이후 추가                      |
| 배포            | `GitHub Actions` → `gh-pages` |                                      |

## 📌 프로젝트 구조

```text
Just-gomin.github.io/
├── app/                          # 라우팅 진입점만 (thin shell)
│   ├── layout.tsx                # 루트 레이아웃 (폰트, 전역 메타데이터, 네비게이션)
│   ├── page.tsx                  # 홈 페이지
│   ├── globals.css
│   ├── posts/
│   │   ├── page.tsx              # 포스트 목록
│   │   └── [slug]/
│   │       └── page.tsx          # 포스트 상세 (generateMetadata + JSON-LD)
│   ├── resume/
│   │   └── page.tsx              # 이력서 페이지
│   ├── sitemap.ts                # 동적 사이트맵 생성
│   └── robots.ts                 # robots.txt 생성
├── features/                     # 도메인별 모듈
│   ├── common/
│   │   ├── constants.ts          # BLOG_TITLE, BLOG_DESCRIPTION
│   │   └── index.ts              # barrel export
│   ├── post/
│   │   ├── components            # React Components
│   │   │   └── index.ts          # barrel export
│   │   ├── lib/
│   │   │   └── posts.ts          # MDX 파싱 유틸 함수
│   │   ├── types.ts              # PostMeta, Post 인터페이스
│   │   └── index.ts              # barrel export
│   └── resume/
│       └── index.ts              # barrel export
├── content/
│   └── posts/
│       └── POSTING_TITLE/
│           ├── index.mdx         # 포스트 본문
│           └── meta.json         # 메타데이터 (title, date, description, tags)
├── public/
│   ├── posts/
│   │   └── POSTING_TITLE/
│   │       └── images/           # 포스트에 사용되는 이미지 (MDX에서 /posts/POSTING_TITLE/images/photo.png 으로 참조)
│   └── .nojekyll                 # GitHub Pages Jekyll 비활성화
├── mdx-components.tsx            # MDX 커스텀 컴포넌트 정의
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 📌 개발 단계

### 1단계 — 뼈대 세우기

### ✅ 완료 상태

- 완료 일시: 2026-03-14
- 브랜치: feat/blog-base-setting
- 커밋: 7276fbf

#### 구현 범위

- 홈 페이지 (`/`)
- 네비게이션 (Resume / POSTINGS)
- 기본 레이아웃 (최대 너비, 여백, 폰트)
- 루트 `layout.tsx`에 전역 Metadata 설정

#### 체크포인트

`pnpm dev`로 로컬에서 홈 화면이 보이면 완료

---

### 2단계 — 배포 파이프라인

### ✅ 완료 상태

- 완료 일시: 2026-03-27
- 브랜치: feat/deploy-pipeline
- 커밋: ed47eb2

#### 구현 범위

##### `next.config.ts` 설정 추가

- `output: 'export'` — 정적 사이트 빌드
- `images: { unoptimized: true }` — `output: 'export'` 필수 설정
- `basePath: ''` — `Just-gomin.github.io` (username.github.io 형식)는 서브패스 불필요
- `trailingSlash: true` — GitHub Pages 라우팅 호환성

##### GitHub 설정

- Repository → Settings → Pages → Source: `GitHub Actions` 으로 변경
- Repository → Settings → Secrets → `CLAUDE_CODE_OAUTH_TOKEN` 추가 (Claude 리뷰용)

##### 워크플로우 파일 구성 (`.github/workflows/`)

총 3개의 워크플로우를 작성합니다.

- `ci.yml` — PR 생성/업데이트 시 실행 (대상: `main`)

  ```text
  트리거: pull_request → main
  단계:
    1. pnpm 설치 및 의존성 캐싱
    2. pnpm install
    3. pnpm lint
    4. pnpm build  ← out/ 생성 여부로 빌드 성공 검증
  ```

- `deploy.yml` — `main` 브랜치 푸시 시 실행

  ```text
  트리거: push → main
  권한: contents: read, pages: write, id-token: write
  단계:
    1. pnpm 설치 및 의존성 캐싱
    2. pnpm install
    3. pnpm build  ← out/ 디렉터리 생성
    4. actions/upload-pages-artifact  ← out/ 업로드
    5. actions/deploy-pages           ← GitHub Pages 배포
  ```

- `claude-review.yml` — PR 생성 또는 코멘트(`@claude` 언급)로 실행

  ```text
  트리거:
    - pull_request (opened, synchronize)
    - issue_comment (created, "@claude" 포함 시)
  단계:
    1. anthropics/claude-code-action@beta
       - ANTHROPIC_API_KEY: secrets.ANTHROPIC_API_KEY
       - PR diff를 컨텍스트로 코드 리뷰 코멘트 작성
  ```

#### 체크포인트

- `pnpm build` 후 `out/` 디렉터리 생성 확인 (로컬에서 정적 빌드 검증)
- `main` 푸시 후 GitHub Pages URL에서 블로그가 열리면 완료
- PR 생성 시 Claude 리뷰 코멘트가 자동으로 달리면 완료

---

### 3단계 — MDX 블로그 핵심

#### 구현 범위

- 타입 정의 (`features/post/types.ts`): `PostMeta { title, date, description, tags }`, `Post extends PostMeta { slug }`
- 포스트 목록 페이지 (`/posts`) — 날짜순 정렬
- 포스트 상세 페이지 (`/posts/[slug]`)
- 메타데이터 관리: `content/posts/[slug]/meta.json` (title, date, description, tags)
- `generateStaticParams`로 정적 경로 생성
- `shiki`로 코드 블록 문법 하이라이팅

#### 체크포인트 MDX 파일 하나를 작성했을 때 상세 페이지가 렌더링되면 완료

---

### 4단계 — 테마 구현

#### 구현 범위

- 폰트 시스템: 모노스페이스 폰트 적용 (body 전체 포함)
- 색상: 오프화이트 배경 + 모노크롬 텍스트
- 2단 레이아웃: 좌측 콘텐츠 영역 + 우측 고정 사이드바
- 사이드바: 상단 네비게이션 (Resume / Postings) + 하단 저자 정보 (이름, 이메일)
- 홈 페이지: `>` chevron 프리픽스 + 굵기+밑줄 강조 텍스트 스타일
- `mdx-components.tsx`: 테마에 맞는 마크다운 요소 스타일링 (h1~h3, p, code, a, ul/li)

#### 체크포인트 zerolog 레퍼런스와 시각적으로 일치하는 홈 화면이 렌더링되면 완료

---

### 5단계 — SEO 최적화

#### 구현 범위

- `generateMetadata`로 포스트별 동적 메타데이터 생성
- JSON-LD 구조화 데이터 (`BlogPosting` 스키마)
- `sitemap.ts` — 프로그래매틱 사이트맵 생성
- `robots.ts` — 크롤러 접근 제어
- Open Graph / Twitter Card 메타태그

#### 체크포인트

- `/posts/[slug]`의 `<head>`에 OG 메타태그 포함
- `pnpm build` 후 `out/sitemap.xml`, `out/robots.txt` 생성
- Google Rich Results Test에서 JSON-LD 인식

---

### 6단계 — Resume 페이지

#### 구현 범위

- Resume 페이지 (`/resume`) — 경력, 프로젝트, 학력, 기술 스택
- 정적 Metadata 설정
- JSON-LD `ProfilePage` 스키마

#### 체크포인트 `/resume` 접속 시 이력서 내용이 렌더링되면 완료

---

### 7단계 — 심화 (이후 지속)

| 기능               | 패키지                  |
| :----------------- | :---------------------- |
| 다크모드           | `next-themes`           |
| 포스트 태그 필터링 | 순수 구현               |
| 댓글               | `giscus`                |
| RSS 피드           | `feed`                  |
| OG Image 자동 생성 | `@vercel/og` + `satori` |
| View Transitions   | React 19.2 내장         |
| 유닛 테스트        | `Jest`                  |

#### 테스트 대상

- `features/post/lib/posts.ts` 유틸 함수 — 포스트 목록 조회, 날짜 정렬, slug 파싱 등 순수 로직
- `features/post/types.ts` 타입 검증 — `PostMeta`, `Post` 인터페이스 구조 확인

#### 설치 및 설정

```bash
pnpm add -D jest jest-environment-jsdom @types/jest ts-jest
```

`package.json` scripts에 `"test": "jest"` 추가 후 `pnpm test`로 실행

## 📌 초기 세팅

```bash
# 현재 디렉토리를 Next.js 앱으로 초기화
pnpm create next-app@latest .

# 추가 패키지 설치
pnpm add date-fns shiki
pnpm add @next/mdx @mdx-js/loader
pnpm add -D prettier husky lint-staged @types/mdx

# husky 초기화
pnpm dlx husky init

# .nojekyll 파일 생성 (GitHub Pages용)
touch public/.nojekyll
```

## 📌 변경 이력

|    날짜    | 버전 |             변경 내용             |
| :--------: | :--: | :-------------------------------: |
| 2026-03-14 | 1.1  |   1단계 (뼈대 세우기) 완료 반영   |
| 2026-03-27 | 1.2  | 2단계 (배포 파이프라인) 완료 반영 |

## 📌 참고

- [zerolog 소스코드](https://github.com/mkitwave/zero-log)
- [Next.js 공식 문서](https://nextjs.org/docs) — App Router, MDX, Static Export
- [Next.js 16 릴리즈 노트](https://nextjs.org/blog/next-16)
- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js JSON-LD 가이드](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js blog-starter 예제](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [shiki 공식 문서](https://shiki.style)
