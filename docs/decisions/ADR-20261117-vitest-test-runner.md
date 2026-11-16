---
id: ADR-20261117-vitest-test-runner
title: 테스트 러너로 Vitest를 쓴다
status: accepted # proposed | accepted
specs: [build]
sources: []
confidence: inferred # stated | inferred
---

## 배경

레포에 테스트 스크립트가 없었고, `.github/workflows/ci.yaml`에는 `pnpm test` 단계가 TODO 주석으로만 남아 있었습니다. `features/note/lib/notes.ts`에 날짜가 잘못되면 오류를 던지는 동작(`ADR-20261117-fail-build-on-invalid-note-date`)이 막 들어와, 노트 정렬과 날짜 검사를 테스트로 지킬 필요가 생겼습니다. 이를 위해 테스트 러너를 하나 골라야 했습니다.

## 결정

Vitest를 테스트 러너로 쓰고 `pnpm test`(`vitest run`)로 실행합니다. CI의 Test 단계도 켭니다.

이유는 다음과 같습니다. Next 16과 TypeScript ESM 프로젝트에서 babel이나 ts-jest 같은 별도 트랜스파일 설정 없이 바로 돌고, 지금 테스트할 대상이 파일 시스템을 읽는 순수 함수(`features/note/lib`)라 브라우저 환경 설정이 필요 없습니다. 그래서 설정 파일 없이 기본값으로 둡니다.

이 이유는 레포 주인이 선택을 맡긴 어시스턴트 팀이 제시했고, 레포 주인이 진행을 승인했습니다. 레포 주인이 직접 밝힌 말이 아니라서 `confidence: inferred`로 둡니다.

## 검토한 대안

- Jest: ESM과 TypeScript를 돌리려면 변환 설정이 필요해 고르지 않았습니다.
- Node 내장 테스트 러너: 의존성이 늘지 않지만 TypeScript를 돌리려면 로더가 필요하고 API가 덜 익숙해 고르지 않았습니다.

## 결과와 감수한 비용

- 개발 의존성에 `vitest`가 추가됩니다.
- Vitest는 Next의 빌드 설정을 쓰지 않습니다. 나중에 React 컴포넌트를 테스트하려면 jsdom 같은 브라우저 환경과 `@/*` 경로 별칭 설정을 따로 더해야 합니다.
- CI가 lint와 build에 더해 테스트까지 통과해야 PR을 통과시킵니다.
