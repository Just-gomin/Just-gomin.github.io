# 디자인 시스템 구현 계획

`plans/designs/just-gomin-blog-design-guide` 의 디자인 가이드를 현재 Next.js 프로젝트에 구현하기 위한 작업 목록입니다.

## 참고 파일

- `plans/designs/just-gomin-blog-design-guide/project/styles.css` — CSS 변수 및 전역 스타일
- `plans/designs/just-gomin-blog-design-guide/project/components.jsx` — 공통 컴포넌트 명세
- `plans/designs/just-gomin-blog-design-guide/project/pages.jsx` — 페이지별 구조
- `plans/designs/just-gomin-blog-design-guide/project/design-system.jsx` — 디자인 원칙

---

## 1단계 — 디자인 토큰 & 전역 CSS

> **목표:** `styles.css`의 CSS 변수와 base 스타일을 `app/globals.css`에 반영합니다.

### 작업 목록

- [ ] **1-1. CSS 변수 정의**

  `app/globals.css` `:root`에 다음 변수를 추가합니다.

  ```css
  --c-fg: #7c7365; /* 기본 텍스트 */
  --c-fg-strong: #5c5347; /* 강조 / hover */
  --c-fg-muted: #b8ae9e; /* 캡션, 메타 */
  --c-fg-faint: #ddd2c2; /* 희미한 테두리 */
  --c-bg: #fbfafa; /* 배경 */
  --c-bg-sub: #f6f2ec; /* 서브 배경 */
  --c-bg-code: #f2eee9; /* 코드 블록 배경 */
  --c-bg-pop: #ffffff;
  --c-stroke: #7c7365;
  --c-stroke-faint: #ddd2c2;
  --c-accent: #6b2c39; /* 딥 와인 */
  --c-accent-soft: #6b2c3914;
  --f-mono:
    "NanumGothicCoding", "D2Coding", "JetBrains Mono", ui-monospace,
    SFMono-Regular, Menlo, Consolas, monospace;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  ```

- [ ] **1-2. 다크 모드 토큰**

  `[data-theme="dark"]` 셀렉터로 다크 모드 변수를 정의합니다.

  ```css
  [data-theme="dark"] {
    --c-fg: #c7beb0;
    --c-fg-strong: #e8e1d3;
    --c-fg-muted: #8b8275;
    --c-fg-faint: #4a4438;
    --c-bg: #1a1815;
    --c-bg-sub: #221e19;
    --c-bg-code: #25211b;
    --c-accent: #c77c8a;
    --c-accent-soft: #c77c8a1f;
    --c-stroke: #c7beb0;
    --c-stroke-faint: #4a4438;
  }
  ```

- [ ] **1-3. base 스타일 적용**

  `app/globals.css`에 다음 내용을 반영합니다.
  - `html, body`: `font-family: var(--f-mono)`, `background: var(--c-bg)`, `color: var(--c-fg)`, `-webkit-font-smoothing: antialiased`
  - `a`: `color: var(--c-fg)`, `text-decoration: none`, hover 시 `color: var(--c-accent)`
  - `a.link`: 언더라인 slide-in 애니메이션 (`::after` pseudo element, `scaleX(0→1)`)
  - `::selection`: `background: var(--c-accent); color: var(--c-bg)`
  - `button`, `input`, `textarea`: `font-family: inherit`

- [ ] **1-4. Tailwind 연동**

  `tailwind.config.ts`에 CSS 변수를 Tailwind 색상으로 등록합니다.

  ```ts
  theme: {
    extend: {
      colors: {
        fg:         'var(--c-fg)',
        'fg-strong':'var(--c-fg-strong)',
        'fg-muted': 'var(--c-fg-muted)',
        'fg-faint': 'var(--c-fg-faint)',
        bg:         'var(--c-bg)',
        'bg-sub':   'var(--c-bg-sub)',
        'bg-code':  'var(--c-bg-code)',
        accent:     'var(--c-accent)',
        'accent-soft':'var(--c-accent-soft)',
      },
      fontFamily: {
        mono: ['var(--f-mono)', 'monospace'],
      },
    },
  }
  ```

- [ ] **1-5. NanumGothicCoding 폰트 로드**

  `app/layout.tsx`에서 `next/font/google`로 폰트를 로드하고 `--f-mono` 변수에 연결합니다.

  ```ts
  import { Nanum_Gothic_Coding } from "next/font/google";
  const nanum = Nanum_Gothic_Coding({
    weight: ["400", "700"],
    subsets: ["latin"],
  });
  // <html className={nanum.variable}> 로 변수 등록
  ```

---

## 2단계 — 레이아웃 & 헤더/푸터

> **목표:** 전체 페이지 골격(`layout.tsx`)을 디자인 가이드의 레이아웃 명세에 맞춥니다.

### 레이아웃 구조

```text
layout (.layout)
├── <Header />   sticky top, height 48px, border
├── <main class="page"> (flex-1, max-width 1440px, page-in animation)
│   └── {children}
└── <Footer />
```

### 작업 목록

- [ ] **2-1. `features/common/components/Header.tsx` 구현**

  구조는 `components.jsx`의 `Header` 컴포넌트를 참고합니다.
  - 상단 sticky 헤더 (`position: sticky; top: 12px; height: 48px; border: 1px solid var(--c-fg); z-index: 50`)
  - 좌측: 네비게이션 링크 — `[x]HOME`, `[ ]RESUME`, `[ ]NOTES`, `[ ]ABOUT` (현재 경로에 따라 active 상태 결정)
  - 우측: 브랜드명 `Just-gomin.log` (`.dot`에 accent 색상)
  - `[x]`/`[ ]` 체크박스 패턴: `<Check>` 컴포넌트 형태로 분리 (`features/common/components/Check.tsx`)
  - `usePathname()`으로 현재 경로 감지

- [ ] **2-2. 모바일 햄버거 & Drawer 구현**

  `components.jsx`의 `Header` 모바일 부분을 참고합니다.
  - `max-width: 720px` 미만에서 nav 숨김, 햄버거 버튼(`[≡]`) 표시
  - Drawer: 좌측 슬라이드-인 (`width: min(320px, 86vw)`), backdrop 클릭으로 닫기
  - `Esc` 키로 닫기, 라우트 변경 시 자동 닫기

- [ ] **2-3. `features/common/components/Footer.tsx` 구현**

  ```text
  © 2026 Just-gomin · just0gomin@gmail.com     github · design-system · built with [x] care
  ```

  - `border-top: var(--line-faint)`, `color: var(--c-fg-muted)`, `font-size: 12px`

- [ ] **2-4. `app/layout.tsx` 루트 레이아웃 업데이트**
  - `.layout` 클래스: `min-h-screen flex flex-col gap-3 p-3 bg-bg`
  - `<main class="page">`: `flex-1 flex flex-col max-w-[1440px] w-full mx-auto animate-page-in`
  - Tailwind `animate-page-in` 커스텀 애니메이션 등록 (`from: opacity-0 translateY(4px)`)

---

## 3단계 — 공통 UI 컴포넌트

> **목표:** `components.jsx`에 정의된 재사용 컴포넌트를 `features/common/components/`에 구현합니다.

### 작업 목록

- [ ] **3-1. `Cursor.tsx`**

  깜박이는 커서 컴포넌트.

  ```tsx
  // width: 0.55em, height: 1em, animation: blink 1.06s steps(2) infinite
  // accent prop: background: var(--c-accent) (기본은 var(--c-fg))
  ```

- [ ] **3-2. `AsciiDivider.tsx`**

  두 가지 변형:
  - 기본: `─ ─ ─ ─ ...` 반복 (`::before` content, `overflow: hidden`)
  - `label` prop 있을 때: `── label ──` (dashed border, 좌우 line)

- [ ] **3-3. `Tag.tsx`**

  ```tsx
  // 형태: #label count
  // is-active 시: "x " prefix + accent 색상
  // hover: color → var(--c-fg)
  // onClick: 필터 toggle용
  ```

- [ ] **3-4. `PageTitle.tsx`**

  ```tsx
  // <h1 class="page-title">
  //   <span class="prefix">{prefix}</span>  {/* // section 같은 회색 prefix */}
  //   <span>{children}</span>
  //   {cursor && <Cursor accent />}
  // </h1>
  // font-size: 24px, font-weight: 700
  ```

- [ ] **3-5. `Typewriter.tsx`**

  타이핑 애니메이션 컴포넌트. `pages.jsx`의 `Typewriter`를 참고합니다.
  - `text` (단순 문자열) 또는 `segments` (링크 포함 배열) 지원
  - `speed`, `delay`, `onDone`, `cursor` props
  - 내부 state로 글자 수를 카운트하며 렌더링

- [ ] **3-6. barrel export 정리**

  `features/common/components/index.ts`에 위 컴포넌트 전체 export 추가.

---

## 4단계 — MDX 컴포넌트

> **목표:** `mdx-components.tsx`를 디자인 가이드 스펙에 맞게 전면 업데이트합니다.

### 작업 목록

- [ ] **4-1. 헤딩 스타일**

  | 태그 | 클래스   | 폰트 크기 |
  | ---- | -------- | --------- |
  | `h1` | `.md-h1` | 32px, 700 |
  | `h2` | `.md-h2` | 24px, 700 |
  | `h3` | `.md-h3` | 20px, 700 |

- [ ] **4-2. 인라인 코드**

  `<code>`: `background: var(--c-bg-code)`, `padding: 1px 6px`, `border-radius: 4px`, `font-size: 0.92em`

- [ ] **4-3. `CodeBlock` 컴포넌트**

  `features/note/components/CodeBlock.tsx`로 구현합니다. (`shiki` 연동)
  - 헤더 영역: 언어 라벨 + 복사 버튼(`CopyButton`)
  - 배경: `var(--c-bg-code)`, `border-radius: 8px`
  - 코드: `font-family: var(--f-mono)`, `line-height: 1.55`

- [ ] **4-4. `CopyButton` 컴포넌트**

  `features/common/components/CopyButton.tsx` — `navigator.clipboard.writeText` 사용, "copy" → "copied" 1.2초 후 복원.

- [ ] **4-5. `Callout` 컴포넌트**

  `features/note/components/Callout.tsx`
  - `kind`: `"note"` | `"warn"` | `"tip"`
  - 좌측 3px border (`note`: fg, `warn`: accent, `tip`: fg-strong)
  - 배경: `var(--c-bg-sub)`

- [ ] **4-6. `Blockquote` 컴포넌트**

  `features/note/components/Blockquote.tsx`
  - 좌측 2px border (`var(--c-fg-faint)`), italic, `author` prop → `<cite>`

- [ ] **4-7. `Toggle` 컴포넌트**

  `features/note/components/Toggle.tsx`
  - `<details>` / `<summary>` 기반
  - summary에 `▸` chevron, open 시 90° 회전
  - `defaultOpen` prop

- [ ] **4-8. `CheckList` 컴포넌트**

  `features/note/components/CheckList.tsx`
  - `items: { text: string; done: boolean }[]`
  - `[x]` / `[ ]` 마크, done 항목에 취소선 + accent 색상

- [ ] **4-9. 표(`table`) 스타일**

  `.md-table`: `width: 100%`, `border-collapse: collapse`, 헤더는 굵게 + 하단 실선, 셀은 하단 faint 선

- [ ] **4-10. 이미지**

  `Next.js <Image>`로 대체, `aspect-ratio` 유지, `border: var(--line-faint)` 추가

- [ ] **4-11. `mdx-components.tsx` 업데이트**

  위 컴포넌트를 MDX element 매핑에 연결합니다.

  ```ts
  export function useMDXComponents(components) {
    return {
      h1: (props) => <h1 className="md-h1" {...props} />,
      h2: (props) => <h2 className="md-h2" {...props} />,
      // ...
      pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
      blockquote: Blockquote,
      // ...
    };
  }
  ```

---

## 5단계 — 홈 페이지

> **목표:** `app/page.tsx`를 디자인 가이드의 HomePage 스펙에 맞게 구현합니다.

### 레이아웃

```text
[ Just-gomin / log / 2026 ]    ← section-label
─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─      ← AsciiDivider

$ Done is better than Perfect_
  // 완벽함보다 완성이 낫습니다

$ Read, write, organize._
  // 읽고, 쓰고, 정리합니다

$ Working on beyo as Product Engineer now._
  // 지금은 beyo에서 Product Engineer로 일합니다
```

### 작업 목록

- [ ] **5-1. `SloganBlock` 컴포넌트 구현**

  `features/common/components/SloganBlock.tsx`
  - `$` prefix (muted 색상)
  - `<Typewriter>` 애니메이션으로 영문 텍스트 표시
  - 완료 후 5초 뒤 반복 (순환)
  - 한글 번역 (`// ko`) fade-in (opacity transition)
  - `index` prop으로 순차 딜레이 (`200 + index * 1200ms`)

- [ ] **5-2. `app/page.tsx` 구조 업데이트**
  - 상단: `[ Just-gomin / log / 2026 ]` + `<AsciiDivider />`
  - 본문: `paddingLeft: 24px`, `gap: 64px` 간격으로 SloganBlock 3개

- [ ] **5-3. 슬로건 데이터 정의**

  `features/common/constants.ts`에 SLOGANS 배열 추가.

  ```ts
  export const SLOGANS = [
    {
      en: "Done is better than Perfect",
      ko: "완벽함보다 완성이 낫습니다",
      segments: [{ text: "Done is better than Perfect" }],
    },
    {
      en: "Read, write, organize.",
      ko: "읽고, 쓰고, 정리합니다",
      segments: [{ text: "Read, write, organize." }],
    },
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

---

## 6단계 — Notes 목록 페이지

> **목표:** `app/notes/page.tsx`를 디자인 가이드의 NotesPage 스펙에 맞게 구현합니다.

### 레이아웃

```text
.notes-grid (grid: 200px 1fr)
├── aside.notes-sidebar
│   ├── "FILTER" 헤더 + CLEAR 버튼
│   └── Tag 목록 (필터 토글)
└── section
    ├── .search (/ 검색창)
    ├── .notes-list-head (WHEN & WHERE / TITLE / TAGS 컬럼)
    └── note-row 목록 또는 EmptyState
```

### 작업 목록

- [ ] **6-1. 태그 필터 상태 관리**

  `'use client'` 컴포넌트 (`features/note/components/NotesClient.tsx`)로 분리합니다. (Next.js 서버 컴포넌트와 분리)
  - `active: string[]` — 선택된 태그 목록
  - `q: string` — 검색어
  - `filtered` — `active`와 `q`로 클라이언트 사이드 필터링

- [ ] **6-2. `NoteRow` 컴포넌트**

  `features/note/components/NoteRow.tsx`
  - 3컬럼 그리드: `180px 1fr 120px`
  - 날짜/장소 (`when`, `where`) + 제목 + 태그
  - hover: 배경 `var(--c-bg-sub)`, `padding-left` +4px 이동, 제목 accent 색상

- [ ] **6-3. `EmptyState` 컴포넌트**

  검색/필터 결과 없을 때: `[ ] 아무것도 찾지 못했어요.` + 힌트 텍스트

- [ ] **6-4. 검색창 스타일**

  `.search`: border, `/` 또는 `grep` prompt, 인풋 full-width, `font-weight: 700`

- [ ] **6-5. `meta.json` 스키마 확장**

  `where` 필드 추가 (예: `"@HOME"`, `"@OFFICE"`). 기존 노트에 기본값 적용.

---

## 7단계 — Note 상세 페이지

> **목표:** `app/notes/[slug]/page.tsx`를 3컬럼 레이아웃으로 재구성합니다.

### 레이아웃

```text
.note-detail-grid (grid: 1fr 640px 1fr)
├── .left (sticky: 날짜, 장소, 태그 목록, ← back)
├── article.content (MDX 본문)
│   └── .toc-inline (모바일 전용 TOC)
└── aside.right (sticky TOC)
    └── .toc (TABLE OF CONTENTS + 스크롤 스파이)
```

### 작업 목록

- [ ] **7-1. 좌측 메타 패널**

  `features/note/components/NoteMetaPanel.tsx`
  - `← back to notes` 링크
  - 날짜, 장소(`where`), 태그 링크 목록
  - `position: sticky; top: 80px`

- [ ] **7-2. `TableOfContents` 컴포넌트**

  `features/note/components/TableOfContents.tsx`
  - MDX에서 헤딩 추출 → `{ id, label, level }[]`
  - 스크롤 스파이: `window.addEventListener('scroll', ...)` + `IntersectionObserver`
  - `is-active` 시 accent 색상 + 좌측 border
  - `h2`: bold 16px, `h3`: 들여쓰기 14px

- [ ] **7-3. 모바일 인라인 TOC**

  `.toc-inline` — `<details>` 기반, 모바일(`max-width: 720px`)에서만 표시

- [ ] **7-4. MDX에서 헤딩 ID 자동 생성**

  `mdx-components.tsx`의 `h2`, `h3` 컴포넌트에서 텍스트 기반 `id` 자동 생성 (한글 slug 처리 포함)

---

## 8단계 — Resume 페이지

> **목표:** `app/resume/page.tsx`를 디자인 가이드의 ResumePage 스펙에 맞게 구현합니다.

### 레이아웃

```text
// resume Just-gomin     ← PageTitle
── profile ──            ← AsciiDivider label="profile"
[profile 6컬럼 그리드]
── career ──
[career 카드들 (2컬럼: 역할/기간 | 업무 항목)]
── contact ──
$ mail → just0gomin@gmail.com
$ github → github.com/Just-gomin
```

### 작업 목록

- [ ] **8-1. 프로필 그리드**

  `features/resume/components/ResumeProfile.tsx`
  - 6컬럼 그리드, 각 셀: key(12px muted) + val(14px bold)
  - `border: var(--line)`, 셀 사이 `border-right: var(--line-faint)`

- [ ] **8-2. 경력 카드**

  `features/resume/components/CareerCard.tsx`
  - 2컬럼 그리드: 좌측(번호/역할/회사/기간) | 우측(업무 항목 박스들)
  - 업무 항목: `border: var(--line-faint)`, `h4 + ul` 구조

- [ ] **8-3. 연락처 섹션**

  `$ mail → email`, `$ github → URL` 형태

- [ ] **8-4. 이력서 데이터 정의**

  `features/resume/data.ts` — `PROFILE_COLS`, `CAREER` 배열 정의

---

## 9단계 — About 페이지 (신규)

> **목표:** 디자인 가이드의 `AboutPage`에 해당하는 페이지를 추가합니다. (현재 PLAN.md에 없는 신규 페이지)

### 작업 목록

- [ ] **9-1. `app/about/page.tsx` 생성**

  구조:

  ```text
  // about whoami    ← PageTitle
  ─ ─ ─ ─ ─ ─ ─    ← AsciiDivider
  [자기소개 텍스트 블록]
  ── interests ──
  [관심사 텍스트]
  ── tools ──
  [툴 카드 3컬럼 그리드]
  ── contact ──
  [이메일 링크]
  ```

- [ ] **9-2. 네비게이션에 ABOUT 추가**

  `Header.tsx`의 `NAV` 배열에 `{ key: 'about', label: 'ABOUT', path: '/about' }` 추가

---

## 10단계 — Search 페이지 (신규)

> **목표:** 디자인 가이드의 `SearchPage`를 구현합니다. (현재 PLAN.md에 없는 신규 페이지)

### 작업 목록

- [ ] **10-1. `app/search/page.tsx` 생성 (Client Component)**
  - `grep` prompt가 있는 검색창
  - 입력 시 제목/요약/태그 전문 검색 (클라이언트 사이드)
  - 결과 없을 때 `EmptyState`
  - 검색 전: 인기 태그 목록 표시

- [ ] **10-2. 키보드 단축키 연결**

  `/` 키 입력 시 `/search`로 이동 또는 검색창 포커스 (`Header.tsx` 또는 루트 레이아웃에 `keydown` 이벤트 추가)

---

## 11단계 — 404 페이지

> **목표:** `app/not-found.tsx`를 디자인 가이드 스펙으로 구현합니다.

### 작업 목록

- [ ] **11-1. `app/not-found.tsx` 업데이트**

  ASCII art + 안내 메시지 + 홈/notes/search 링크

  ```text
    _  _    ___  _  _
   | || |  / _ \| || |
   ...

  요청하신 페이지를 찾을 수 없어요.
  ← home   browse notes   search
  ```

---

## 12단계 — 반응형 (모바일)

> **목표:** `max-width: 720px` 및 `max-width: 420px` 브레이크포인트에서 디자인 가이드의 모바일 스펙을 충족합니다.

### 주요 변경 사항 (`styles.css` 참고)

- [ ] **12-1. Header**: nav 숨김 → 햄버거 표시, brand 크기 축소 (24px → 20px)
- [ ] **12-2. Slogan**: 48px → 24px, 한글 20px → 14px
- [ ] **12-3. Note 목록**: 3컬럼 row → 1컬럼 카드 (`border-radius: 8px`)
  - 필터 사이드바: 수평 스크롤 태그 바 (sticky top: 72px)
- [ ] **12-4. Note 상세**: 3컬럼 → 1컬럼, 우측 TOC 숨김, 인라인 TOC 표시
- [ ] **12-5. Resume**: profile 6컬럼 → 2컬럼, career 2컬럼 → 1컬럼
- [ ] **12-6. 420px 이하**: slogan 48→20px, profile 2→1컬럼

---

## 구현 순서 요약

```text
1단계 (CSS 토큰)
  → 2단계 (레이아웃/헤더)
    → 3단계 (공통 컴포넌트)
      → 4단계 (MDX 컴포넌트)
        → 5단계 (홈 페이지)
        → 6단계 (Notes 목록)
        → 7단계 (Note 상세)
        → 8단계 (Resume)
        → 9단계 (About — 신규)
        → 10단계 (Search — 신규)
        → 11단계 (404)
          → 12단계 (반응형)
```

각 단계는 이전 단계 완료 후 진행합니다. 5~11단계는 3~4단계 완료 후 병렬 진행 가능합니다.

---

## 신규 파일 목록

| 파일 경로                                      | 설명                          |
| ---------------------------------------------- | ----------------------------- |
| `features/common/components/Check.tsx`         | `[x]`/`[ ]` 체크박스 UI       |
| `features/common/components/Cursor.tsx`        | 블링크 커서                   |
| `features/common/components/AsciiDivider.tsx`  | ASCII 구분선                  |
| `features/common/components/Tag.tsx`           | 태그 (필터용)                 |
| `features/common/components/PageTitle.tsx`     | 페이지 제목 (`//` prefix)     |
| `features/common/components/Typewriter.tsx`    | 타이핑 애니메이션             |
| `features/common/components/CopyButton.tsx`    | 코드 복사 버튼                |
| `features/common/components/SloganBlock.tsx`   | 홈 슬로건 블록                |
| `features/common/components/Header.tsx`        | 헤더 (nav, 햄버거, drawer)    |
| `features/common/components/Footer.tsx`        | 푸터                          |
| `features/note/components/NoteRow.tsx`         | 노트 목록 행                  |
| `features/note/components/NotesClient.tsx`     | 필터/검색 클라이언트 컴포넌트 |
| `features/note/components/EmptyState.tsx`      | 빈 상태 UI                    |
| `features/note/components/NoteMetaPanel.tsx`   | 노트 상세 좌측 메타 패널      |
| `features/note/components/TableOfContents.tsx` | 목차 + 스크롤 스파이          |
| `features/note/components/CodeBlock.tsx`       | shiki 코드 블록               |
| `features/note/components/Callout.tsx`         | 콜아웃 (note/warn/tip)        |
| `features/note/components/Blockquote.tsx`      | 인용구                        |
| `features/note/components/Toggle.tsx`          | 접기/펼치기                   |
| `features/note/components/CheckList.tsx`       | `[x]`/`[ ]` 체크리스트        |
| `features/resume/components/ResumeProfile.tsx` | 이력서 프로필 그리드          |
| `features/resume/components/CareerCard.tsx`    | 경력 카드                     |
| `features/resume/data.ts`                      | 이력서 데이터                 |
| `app/about/page.tsx`                           | About 페이지 (신규)           |
| `app/search/page.tsx`                          | Search 페이지 (신규)          |
