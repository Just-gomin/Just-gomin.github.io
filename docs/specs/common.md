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
- `Nav`는 HOME, RESUME, NOTES 세 링크와 블로그 제목을 보여 줍니다. 현재 경로에 해당하는 링크는 `[*]`, 나머지는 `[ ]`로 표시합니다.
- `app/layout.tsx`가 모든 페이지에 내비게이션을 얹고, 나눔고딕코딩 글꼴, 사이트 메타데이터, 오픈 그래프, 파비콘, 테마 색(`#7C7365`)을 설정합니다.
- `app/globals.css`가 글자 크기와 여백 같은 디자인 토큰과 전역 스타일을 정합니다.
