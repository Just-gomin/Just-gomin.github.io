---
id: common
title: 공통 레이아웃과 홈
paths:
  - features/common/**
  - app/layout.tsx
  - app/globals.css
  - app/page.tsx
tests: []
depends_on: []
---

> 초안입니다. 2026-11-13에 코드만 읽고 쓴 것이라 의도는 확인되지 않았습니다. 아래 "확인이 필요한 질문"에 답한 뒤 이 문단을 지웁니다.

여러 기능이 함께 쓰는 코드를 묶은 플랫폼 스펙입니다.

## 지금 동작

- `features/common/constants.ts`가 블로그 제목(`Just-gomin.log`)과 설명을 정합니다. 레이아웃의 메타데이터와 내비게이션이 이 값을 씁니다.
- `Nav`는 HOME, RESUME, NOTES 세 링크와 블로그 제목을 보여 줍니다. 현재 경로에 해당하는 링크는 `[*]`, 나머지는 `[ ]`로 표시합니다.
- `app/layout.tsx`가 모든 페이지에 내비게이션을 얹고, 나눔고딕코딩 글꼴, 사이트 메타데이터, 오픈 그래프, 파비콘, 테마 색(`#7C7365`)을 설정합니다.
- `app/globals.css`가 글자 크기와 여백 같은 디자인 토큰과 전역 스타일을 정합니다.
- `/`(홈)은 문장 세 줄을 크게 보여 줍니다. 마지막 문장에 외부 사이트와 `/resume`으로 가는 링크가 있습니다.

## 확인이 필요한 질문

1. 홈 화면(`app/page.tsx`)을 이 스펙에 넣었습니다. 홈에 내용이 늘어나면 `home` 스펙으로 나누는 편이 낫습니다.
2. `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json` 같은 설정 파일은 어느 스펙에도 넣지 않았습니다. 정적 내보내기처럼 동작을 바꾸는 설정이 있어, 이 스펙에 넣을지 따로 `build` 스펙을 둘지 정해야 합니다.
