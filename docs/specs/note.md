---
id: note
title: 노트 목록과 본문
paths:
  - features/note/**
  - app/notes/**
  - mdx-components.tsx
tests: []
depends_on: [common]
---

## 지금 동작

- 노트 한 편은 `content/notes/<slug>/` 폴더입니다. 본문은 `index.mdx`, 메타데이터는 `meta.json`에 둡니다. 폴더 이름이 URL의 slug가 됩니다. 둘을 나눈 이유는 `ADR-20261113-note-meta-json`에 있습니다.
- `meta.json`에는 `title`, `date`(ISO 8601), `description`, `tags`가 있고 `where`는 선택입니다.
- `features/note/lib/notes.ts`가 빌드 시점에 파일 시스템을 읽습니다. `getAllNotes`는 전체 노트를 날짜 내림차순으로 돌려주고, `getNote`는 한 편을, `generateNoteStaticParams`는 정적 경로용 slug 목록을 돌려줍니다.
- `/notes`는 왼쪽에 태그 필터, 오른쪽에 노트 목록을 보여 줍니다. 목록의 각 줄은 날짜, 장소, 제목이며 `/notes/<slug>`로 이동합니다.
- `/notes/[slug]`는 `meta.json`으로 페이지 제목과 설명을 만들고, `index.mdx`를 동적 import해 렌더링합니다.
- `mdx-components.tsx`가 MDX의 제목, 문단, 목록, 링크, 코드를 블로그 스타일로 바꿉니다. 코드 블록은 shiki의 `vitesse-light` 테마로 하이라이트하고, 링크는 새 탭으로 엽니다. MDX는 지금 노트에서만 쓰므로 이 스펙에 둡니다.

## 아직 동작하지 않는 것

- 태그 필터는 태그를 나열만 합니다. 태그 버튼과 CLEAR 버튼에 동작이 없습니다.
- `Note` 타입의 `coverImage`는 선언만 있고 쓰이지 않습니다.
- `meta.json`의 날짜가 잘못되면 콘솔에 오류만 남기고 계속 진행합니다.

## 범위에 넣지 않은 것

- `content/notes/**`는 코드가 아니라 글이라 `paths`에 넣지 않았습니다. 글 폴더 구조를 바꾸게 되면 그때 다시 검토합니다.
