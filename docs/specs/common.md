---
id: common
title: 공통 레이아웃
paths:
  - features/common/**
  - app/layout.tsx
  - app/globals.css
tests: []
depends_on: []
---

여러 기능이 함께 쓰는 코드를 묶은 플랫폼 스펙입니다.

## 지금 동작

- `features/common/constants.ts`가 블로그 제목(`Just-gomin.log`)과 설명을 정합니다. 레이아웃의 메타데이터와 내비게이션이 이 값을 씁니다.
- `Header`는 화면 위에 붙어 있는(sticky) 머리글입니다. 왼쪽에 HOME, RESUME, NOTES 세 링크를, 오른쪽에 브랜드 `Just-gomin.log`를 보여 줍니다. 브랜드의 `.`은 강조 색입니다. 링크 앞의 체크박스는 `Check`가 그립니다. 현재 경로에 해당하는 링크는 `[x]`(`x`는 강조 색), 나머지는 `[ ]`입니다. ABOUT 링크는 About 페이지가 생길 때 더합니다.
- 화면 폭이 720px 이하면 머리글의 링크 대신 `[≡]` 버튼이 나옵니다. 누르면 왼쪽에서 서랍(drawer)이 열리고 같은 링크와 GitHub 링크를 보여 줍니다. 서랍은 바깥을 누르거나, `Esc`를 누르거나, 링크로 이동하면 닫히며, 열려 있는 동안 페이지는 스크롤되지 않습니다.
- `app/layout.tsx`가 모든 페이지에 머리글을 얹고, 나눔고딕코딩 글꼴, 사이트 메타데이터, 오픈 그래프, 파비콘, 테마 색(`#7C7365`)을 설정합니다.
- `app/globals.css`가 글자 크기와 여백 같은 디자인 토큰과 전역 스타일을 정합니다.
