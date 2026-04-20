# 디자인 시스템 & 테마 구현 가이드

> Figma PROFILES > Just_gomin 페이지 기반 분석 (2026-04-13)
> 현재 완료된 항목은 ✅, 미완료는 체크박스로 표시

---

## 1. 디자인 토큰 (Design Tokens)

### 1-1. 색상

| 변수            | 값        | 용도                  | 상태   |
| --------------- | --------- | --------------------- | ------ |
| `--background`  | `#FBFAFA` | 페이지 배경           | ✅     |
| `--foreground`  | `#7C7365` | 기본 텍스트           | ✅     |
| `--color-orbit` | `#DDD2C2` | 파비콘 orbit (장식용) | 참고용 |

> 디자인상 별도 border 색상이 지정되어 있지 않습니다. 구분선은 `--foreground`를 낮은 opacity로 사용하거나,
> `currentColor`에 `opacity` 유틸리티를 조합해 표현합니다.

### 1-2. 타이포그래피

| 변수                         | 값           | 사용처           | 상태 |
| ---------------------------- | ------------ | ---------------- | ---- |
| `--font-nanum-gothic-coding` | Google Fonts | 전체 폰트        | ✅   |
| `--font-size-display`        | `64px`       | HOME 텍스트 블록 | ✅   |
| `--font-size-heading`        | `36px`       | (예비)           | ✅   |
| `--font-size-subheading`     | `20px`       | MDX h2, TOC 제목 | ✅   |
| `--font-size-body`           | `16px`       | 기본 텍스트, Nav | ✅   |

- [x] Tailwind `@theme` 블록에 `--font-size-small: 12px` 추가

  > Figma 스크린샷에서 Nav 비활성 링크와 `just0gomin@gmail.com` 이메일이
  > body(16px)보다 작게 렌더링됩니다. 브라우저 개발자 도구로 실제 적용 크기를 확인 후
  > 필요하면 추가합니다.

  ```css
  /* app/globals.css — @theme inline 블록 내부 */
  --font-size-small: 12px;
  ```

### 1-3. 간격

| 변수             | 값     | 상태 |
| ---------------- | ------ | ---- |
| `--padding-base` | `12px` | ✅   |
| `--margin-base`  | `12px` | ✅   |

---

## 2. 레이아웃 구조

Figma 기준 뷰포트: **1440px × 1024px**

```text
┌─────────────────────────────────────────┐
│  Nav (height: 48px, padding: 12px)      │
├─────────────────────────────────────────┤
│  <main> (padding: 12px)                 │
│    page content                         │
└─────────────────────────────────────────┘
```

### 2-1. `app/layout.tsx` — `<main>` 패딩

- [x] `<main>` 태그에 Nav와 동일한 padding 적용

  ```tsx
  <main style={{ padding: "var(--padding-base)" }}>{children}</main>
  ```

  > Nav는 이미 `style={{ padding: "var(--padding-base)" }}`를 사용합니다.
  > `<main>`도 동일하게 맞춰 콘텐츠 좌우 시작점을 일치시킵니다.

### 2-2. `features/common/components/Nav.tsx` — 활성 링크 크기

Figma 스크린샷에서 활성 링크(`/HOME`, `/NOTES` 등)가 비활성 링크보다 시각적으로 큽니다.
현재 구현은 활성/비활성 모두 `--font-size-body`(16px)입니다.

- [x] 브라우저에서 렌더링 결과를 Figma 스크린샷과 비교
  - 차이가 있다면 활성 링크에 `text-(length:--font-size-subheading)` 적용을 검토합니다.

  현재:

  ```tsx
  isActive(href)
    ? "text-(length:--font-size-body) font-bold underline"
    : "text-(length:--font-size-body)";
  ```

  수정 후 (필요한 경우):

  ```tsx
  isActive(href)
    ? "text-(length:--font-size-heading) font-bold underline"
    : "text-(length:--font-size-body)";
  ```

---

## 3. 페이지별 구현 가이드

### 3-1. HOME 페이지 (`app/page.tsx`)

Figma 위치 정보 (1024px 기준):

- `<body>` 전체 영역 940px 중 텍스트 블록 시작 y ≈ 310px (약 33% 지점)

- [x] 3개 텍스트 블록, `--font-size-display`(64px), 세로 여백 포함

  ```tsx
  export default function Home() {
    return (
      <div className="flex min-h-[calc(100vh-48px)] flex-col justify-center gap-16">
        <p className="text-(length:--font-size-display)">
          Done is better than Perfect.
        </p>
        <p className="text-(length:--font-size-display)">
          Read, write,organize.
        </p>
        <p className="text-(length:--font-size-display)">
          Working on{" "}
          <a
            href="..."
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            beyo
          </a>{" "}
          as{" "}
          <a
            href="..."
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Product Engineer
          </a>{" "}
          now.
        </p>
      </div>
    );
  }
  ```

  > `min-h-[calc(100vh-48px)]`는 Nav(48px)를 제외한 높이에서 수직 중앙 정렬입니다.
  > `justify-center`는 Figma의 y≈310 위치를 근사합니다.

---

### 3-2. NOTES 목록 페이지 (`app/notes/page.tsx`)

Figma 레이아웃 측정값:

```text
┌──────────────────────────────────────────────────┐
│  FILTER sidebar (180px)  │  NOTES LIST (1200px)  │
│  ├ FILTER header (44px)  │  ├ header row (44px)  │
│  └ tag list              │  └ items (76px each)  │
└──────────────────────────────────────────────────┘
```

#### FILTER 사이드바

- [x] 왼쪽 사이드바: 너비 180px, 헤더 "FILTER"(44px) + 태그 목록

  ```tsx
  <aside style={{ width: "180px" }}>
    <div style={{ height: "44px" }} className="flex items-center">
      <span className="text-(length:--font-size-body)">FILTER</span>
    </div>
    <ul>
      {tags.map((tag) => (
        <li key={tag}>
          <label>
            <input type="checkbox" /> {tag}
          </label>
        </li>
      ))}
    </ul>
  </aside>
  ```

#### NOTES 목록

- [ ] 헤더 행: "WHEN & WHERE" | "TITLE"
- [ ] 각 항목: 날짜 + @장소 | 제목, 높이 76px, 하단 구분선

  ```text
  [날짜]     [제목]
  202X.XX.XX TITLE
  @HOME
  ──────────────────────────────────
  ```

  항목 하단 구분선:

  ```tsx
  <div className="border-foreground/20 border-b" />
  ```

#### 데이터 타입 (NoteMetaData 참고)

- `date`: `202X.XX.XX` 형식 표시
- `where`: `@HOME` 등 장소 정보 — `NoteMetaData`에 이미 `where` 필드 존재

---

### 3-3. NOTE 상세 페이지 (`app/notes/[slug]/page.tsx`)

Figma 레이아웃 측정값:

```text
┌────────────────────────────────────────────────────────────────┐
│  space-top (60px)                                              │
│  ┌──────────────────────────────────────┐  ┌───────────────┐  │
│  │  (left padding 262px)                │  │  TOC (240px)  │  │
│  │  Markdown content (640px)            │  │               │  │
│  └──────────────────────────────────────┘  └───────────────┘  │
│  space-bottom (60px)                                           │
└────────────────────────────────────────────────────────────────┘
```

- [ ] 본문 레이아웃: markdown 640px + TOC 240px, 좌측 262px 들여쓰기

  ```tsx
  <div className="flex">
    <article style={{ marginLeft: "262px", width: "640px" }}>
      {/* MDX content */}
    </article>
    <aside style={{ width: "240px", marginLeft: "auto" }}>{/* TOC */}</aside>
  </div>
  ```

#### TOC 구성

- [ ] 제목 "TABLE OF CONTENTS" (44px 헤더)
- [ ] h1, h2(들여쓰기 8px), h3(들여쓰기 16px) 계층 구조

#### 코드 블록 (MDX)

Figma 코드 블록 구조:

```text
┌──────────────────────────────────┐
│  [Copy]  JavaScript              │  ← lang & copy button (28px)
├──────────────────────────────────┤
│  console.log("Hello World");     │  ← code content
└──────────────────────────────────┘
```

- [ ] `mdx-components.tsx`의 `pre` 컴포넌트에 언어 레이블 + 복사 버튼 추가

  > 현재 `pre`만 재정의된 상태. 언어명은 `data-language` 속성에서 읽고,
  > 복사 버튼은 클라이언트 컴포넌트로 분리합니다.

---

### 3-4. RESUME 페이지 (`app/resume/page.tsx`)

#### 프로필 테이블

Figma 측정값: 7개 컬럼, 각 194.28px (균등 분할)

| id  | name | createdAt | email | job | favoriteService | interest |
| --- | ---- | --------- | ----- | --- | --------------- | -------- |

- [ ] 프로필 테이블: 헤더 행(32px) + 데이터 행(100px)

  ```tsx
  const PROFILE_COLUMNS = [
    { key: "id", label: "id", value: "just-gomin" },
    { key: "name", label: "name", value: "안강민" },
    { key: "createdAt", label: "createdAt", value: "1995" },
    { key: "email", label: "email", value: "just0gomin@gmail.com" },
    { key: "job", label: "job", value: "Developer" },
    {
      key: "favoriteService",
      label: "favoriteService",
      value: "[ Notion, Obsidian, Naver Map ]",
    },
    {
      key: "interest",
      label: "interest",
      value: "[ 시간, 장소, 사람, 기록, 생산성, 연결 ]",
    },
  ];
  ```

  > 컬럼 너비는 `grid-cols-7` 또는 `flex` + `flex-1`로 균등 분할합니다.

#### 경력 항목 (RESUME-CAREER-ITEM)

Figma 측정값: 너비 1384px, 높이 276px

- [ ] 경력 항목 컴포넌트 구조 파악 후 구현

  > Figma의 `RESUME-CAREER-ITEM` 심볼 내부 구조는 별도 스크린샷이 필요합니다.
  > Figma에서 직접 확인 후 필드를 정의합니다.

---

## 4. MDX 스타일링 (`mdx-components.tsx`)

Figma NOTE 페이지 텍스트 측정값:

| 요소     | 높이(px) | 해당 CSS 변수                        |
| -------- | -------- | ------------------------------------ |
| Heading1 | 32px     | `--font-size-heading` (36px 근사)    |
| Heading2 | 24px     | `--font-size-subheading` (20px 근사) |
| Heading3 | 20px     | `--font-size-subheading`             |
| Body     | 16px     | `--font-size-body`                   |

> 기존 task 파일(`2026-04-13-stage4-theme-remaining.md`) 4번 항목 참고.
> h1~h3, p, code, a, ul, li 컴포넌트 재정의.

---

## 5. 구현 우선순위

```text
1순위 (레이아웃 기반)
  - main 패딩 추가
  - HOME 페이지 텍스트 블록

2순위 (핵심 페이지)
  - NOTES 목록 페이지 레이아웃
  - MDX 스타일링

3순위 (상세 기능)
  - NOTE 상세 페이지 레이아웃 + TOC
  - 코드 블록 언어 레이블 + 복사 버튼

4순위 (완성도)
  - RESUME 페이지
  - Nav 폰트 크기 검토
```

---

## 참고: Figma 노드 ID 맵

| 페이지                 | Figma Node ID |
| ---------------------- | ------------- |
| Just_gomin 캔버스 전체 | `511:32`      |
| THEME 섹션             | `1110:60`     |
| PAGE-HOME              | `1141:216`    |
| PAGE-NOTES             | `1144:238`    |
| PAGE-NOTE              | `1196:127`    |
| PAGE-RESUME            | `1134:68`     |
| LAYOUT-HEADER (WEB)    | `1141:168`    |
