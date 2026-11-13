---
id: resume
title: 이력서
paths:
  - features/resume/**
  - app/resume/**
tests: []
depends_on: [common]
---

## 지금 동작

- `/resume`은 홈으로 가는 링크와 "This is resume page." 문구만 보여 주는 자리 표시 페이지입니다.
- `features/resume/index.ts`는 주석 한 줄만 있는 빈 모듈입니다.
- 내비게이션과 홈 화면의 "Product Engineer" 링크가 이 페이지를 가리킵니다.

## 정해진 방향

- 이력서 내용은 `content/` 아래 파일로 두지 않고 컴포넌트에 직접 작성합니다.
