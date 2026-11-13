---
id: build
title: 빌드와 배포
paths:
  - next.config.ts
  - tsconfig.json
  - eslint.config.mjs
  - postcss.config.mjs
  - package.json
  - pnpm-workspace.yaml
  - .github/workflows/ci.yaml
  - .github/workflows/deploy.yaml
tests: []
depends_on: []
---

동작을 바꾸는 설정 파일과 CI, 배포 워크플로를 묶은 플랫폼 스펙입니다.

## 지금 동작

- `next.config.ts`가 정적 내보내기(`output: "export"`)를 켜고, 이미지 최적화를 끄고, URL 끝에 `/`를 붙입니다. `.md`와 `.mdx`를 페이지 확장자로 받아 MDX를 처리합니다.
- `tsconfig.json`이 `@/*`를 레포 루트로 잇습니다. 코드의 `@/features/...`, `@/content/...` import가 이 설정에 기대고 있습니다.
- `package.json`의 명령은 `pnpm dev`, `pnpm build`, `pnpm lint`입니다. 테스트 스크립트는 아직 없습니다. 커밋할 때 husky와 lint-staged가 eslint와 prettier를 돌립니다.
- `ci.yaml`은 `main`으로 가는 PR에서 Node 24와 pnpm 10으로 lint와 build를 돌립니다.
- `deploy.yaml`은 `main`에 push되면 build한 `out/`을 GitHub Pages에 배포합니다.

## 범위에 넣지 않은 것

- `.github/workflows/claude.yml`, `.github/workflows/claude-code-review.yml`은 빌드와 배포가 아니라 리뷰 자동화라 넣지 않았습니다.
