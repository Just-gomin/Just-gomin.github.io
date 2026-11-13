---
id: resume
title: 이력서
paths:
  - features/resume/**
  - app/resume/**
tests: []
depends_on: [common]
---

> 초안입니다. 2026-11-13에 코드만 읽고 쓴 것이라 의도는 확인되지 않았습니다. 아래 "확인이 필요한 질문"에 답한 뒤 이 문단을 지웁니다.

## 지금 동작

- `/resume`은 홈으로 가는 링크와 "This is resume page." 문구만 보여 주는 자리 표시 페이지입니다.
- `features/resume/index.ts`는 주석 한 줄만 있는 빈 모듈입니다.
- 내비게이션과 홈 화면의 "Product Engineer" 링크가 이 페이지를 가리킵니다.

## 확인이 필요한 질문

1. 이력서 내용은 어디에 둘 계획인가요? 노트처럼 `content/` 아래 파일로 둘지, 컴포넌트에 직접 쓸지 정해지면 이 스펙의 `paths`가 달라집니다.
