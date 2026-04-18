# 4단계 나머지 항목 작업 계획

> 4단계(테마 구현) 중 폰트 시스템과 Nav 컴포넌트가 완료된 상태.
> 색상, 레이아웃 정리, 홈 페이지, MDX 스타일링을 마무리한다.

---

## 1. 색상 시스템

### `app/globals.css`

- [x] ~~`--background` 값을 `#fbfafa` → `#FAF5EE` 로 변경~~

  ```diff
  - --background: #fbfafa;
  + --background: #FAF5EE;
  ```

- background 는 `fbfafa`가 올바름

---

## 2. 레이아웃 정리

### `features/common/components/Nav.tsx`

- [x] `"algin-baseline"` typo 수정

  현재 코드 (34번 줄):

  ```ts
  ) + "algin-baseline"
  ```

  수정 후:

  ```ts
  ) + " align-baseline"
  ```

  > 주의: `+` 연산자로 문자열을 붙일 때 앞에 공백이 없으면 Tailwind 클래스가 앞 클래스명에 붙어 인식되지 않습니다.

### `app/layout.tsx`

- [x] `<main>` 태그에 `max-width`, `padding` 클래스 추가

  현재:

  ```tsx
  <main>{children}</main>
  ```

  수정 후 (예시 — 실제 값은 디자인에 맞게 조정):

  ```tsx
  <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
  ```

  > `max-w-2xl`(672px) 또는 `max-w-3xl`(768px) 중 선택. Nav와 콘텐츠 폭이 맞는지 확인 후 결정.

---

## 3. 홈 페이지 재작성

### `app/page.tsx`

- [x] 기존 내용을 지우고 3개의 텍스트 블록으로 교체

  블록 구성:
  1. `"Done is better than Perfect"` — 단순 텍스트
  2. `"Read, write, organize._"` — trailing underscore 포함
  3. `"Working on [beyo](링크) as [Product Engineer](링크) now."` — 두 곳 모두 underline 스타일 `<a>` 또는 Next.js `<Link>`

  요구사항:
  - 블록 간 충분한 세로 여백 (`mb-8` 또는 `space-y-8` 등)
  - chevron prefix(`>`, `»`) 없음
  - 링크는 `underline` 스타일 적용, 색상은 `--foreground` 유지

  ```tsx
  // 예시 구조 (실제 href, 클래스명은 직접 결정)
  export default function Home() {
    return (
      <div className="space-y-8">
        <p>Done is better than Perfect</p>
        <p>Read, write, organize._</p>
        <p>
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

---

## 4. MDX 스타일링

### `mdx-components.tsx`

현재 `pre`(코드 블록)만 재정의된 상태. 아래 요소를 `useMDXComponents` 반환 객체에 추가한다.

- [ ] `h1` — 큰 크기 + 하단 여백

  ```tsx
  h1: ({ children }) => (
    <h1 className="text-(length:--font-size-heading) font-bold mt-8 mb-4">{children}</h1>
  ),
  ```

- [ ] `h2` — 중간 크기 + 상하 여백

  ```tsx
  h2: ({ children }) => (
    <h2 className="text-(length:--font-size-subheading) font-bold mt-6 mb-3">{children}</h2>
  ),
  ```

- [ ] `h3` — body 크기와 유사 + 상하 여백

  ```tsx
  h3: ({ children }) => (
    <h3 className="text-(length:--font-size-body) font-bold mt-4 mb-2">{children}</h3>
  ),
  ```

- [ ] `p` — `leading-relaxed` 적용

  ```tsx
  p: ({ children }) => (
    <p className="leading-relaxed mb-4">{children}</p>
  ),
  ```

- [ ] `code` (인라인) — 동일 폰트 유지 + 미세 배경색

  ```tsx
  code: ({ children }) => (
    <code className="font-nanum-gothic-coding bg-black/5 px-1 rounded">{children}</code>
  ),
  ```

  > `pre` 안의 `code`는 Shiki가 처리하므로 이 재정의는 인라인 `` `code` ``에만 영향.

- [ ] `a` — underline + 테마 색상 유지

  ```tsx
  a: ({ href, children }) => (
    <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ```

- [ ] `ul` — 들여쓰기 적용

  ```tsx
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-4 pl-4">{children}</ul>
  ),
  ```

- [ ] `li` — 항목 간 여백 (부모 `ul`의 `space-y-1`로 충분하면 생략 가능)

  ```tsx
  li: ({ children }) => <li>{children}</li>,
  ```

---

## 검증 방법

```bash
pnpm dev
```

|                  확인 항목                   | 방법                                                           |
| :------------------------------------------: | :------------------------------------------------------------- |
|     배경색이 크림 화이트(`#FAF5EE`)인지      | 브라우저 개발자 도구 → Computed 탭에서 `background-color` 확인 |
| NanumGothicCoding이 모든 텍스트에 적용되는지 | 개발자 도구 → `font-family` 확인                               |
|     홈 화면 3개 텍스트 블록 + 링크 동작      | `http://localhost:3000` 접속 후 클릭 테스트                    |
|   MDX 스타일 (제목 계층, 코드 블록, 링크)    | `/notes/[slug]` 페이지 접속 (MDX 파일 있는 경우)               |
|        Nav typo 수정 후 레이아웃 무결        | Nav 항목 간 정렬 확인                                          |
