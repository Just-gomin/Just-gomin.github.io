---
id: note
title: 노트 목록과 본문
paths:
  - features/note/**
  - app/notes/**
  - mdx-components.tsx
tests:
  - features/note/**/*.test.ts
depends_on: [common]
---

## 지금 동작

- 노트 한 편은 `content/notes/<slug>/` 폴더입니다. 본문은 `index.mdx`, 메타데이터는 `meta.json`에 둡니다. 폴더 이름이 URL의 slug가 됩니다. 둘을 나눈 이유는 `ADR-20261113-note-meta-json`에 있습니다.
- `meta.json`에는 `title`, `date`(ISO 8601), `description`, `tags`가 있고 `where`는 선택입니다. 대표 이미지 항목은 없습니다. 쓰지 않던 `Note.coverImage`를 없앤 이유는 `ADR-20261117-remove-note-cover-image`에 있습니다.
- `features/note/lib/notes.ts`가 빌드 시점에 파일 시스템을 읽습니다. `getAllNotes`는 전체 노트를 날짜 내림차순으로 돌려주고, 날짜가 같으면 slug 오름차순(로케일과 무관한 코드 단위 비교)으로 정렬해 파일 시스템이 폴더를 읽는 순서와 상관없이 같은 순서를 냅니다. 이유는 `ADR-20261117-note-sort-slug-tiebreak`에 있습니다. `getNote`는 한 편을, `generateNoteStaticParams`는 정적 경로용 slug 목록을 돌려줍니다.
- `meta.json`의 `date`가 유효한 날짜가 아니면 slug와 잘못된 값을 담은 오류를 던져 빌드를 실패시킵니다. 이유는 `ADR-20261117-fail-build-on-invalid-note-date`에 있습니다.
- `features/note/lib/notes.test.ts`가 임시 폴더에 노트를 만들어 날짜 내림차순 정렬, 같은 날짜의 slug 오름차순 정렬, 잘못된 날짜의 오류, `getNote`의 결과를 확인합니다. 실제 `content/notes`에는 기대지 않습니다.
- `/notes`는 왼쪽에 태그 필터, 오른쪽에 노트 목록을 보여 줍니다. 목록의 각 줄은 날짜, 장소, 제목이며 `/notes/<slug>`로 이동합니다.
- 태그 필터에서 태그를 누르면 선택이 켜지고 꺼지며, 선택한 태그는 URL 쿼리 `?tags=a,b`에 들어갑니다. 고른 태그 중 하나라도 가진 노트만 목록에 남습니다(OR). 선택한 태그는 `[*]`, 고르지 않은 태그는 `[ ]`로 보이고, CLEAR는 쿼리를 지워 전체 목록으로 돌아갑니다. 이렇게 정한 이유는 `ADR-20261117-tag-filter-url-query`에 있습니다.
- 쿼리 해석, 태그 토글, 거르기는 `features/note/lib/tags.ts`의 순수 함수이고 `features/note/lib/tags.test.ts`가 확인합니다. `NoteBrowser` 클라이언트 컴포넌트가 쿼리를 읽어 필터와 목록을 그립니다. 정적 내보내기라 `/notes` 페이지는 이를 `<Suspense>`로 감싸고, 미리 렌더링한 HTML에는 필터 없는 전체 목록과 비활성화된 필터 버튼을 둡니다. 클라이언트로는 노트 본문을 빼고 넘깁니다.
- `/notes/[slug]`는 `meta.json`으로 페이지 제목과 설명을 만들고, `index.mdx`를 동적 import해 렌더링합니다.
- `mdx-components.tsx`가 MDX의 제목, 문단, 목록, 링크, 코드를 블로그 스타일로 바꿉니다. 코드 블록은 shiki의 `vitesse-light` 테마로 하이라이트하고, 링크는 새 탭으로 엽니다. MDX는 지금 노트에서만 쓰므로 이 스펙에 둡니다.

## 범위에 넣지 않은 것

- `content/notes/**`는 코드가 아니라 글이라 `paths`에 넣지 않았습니다. 글 폴더 구조를 바꾸게 되면 그때 다시 검토합니다.
