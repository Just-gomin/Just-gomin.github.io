# GitHub Actions Node.js 24 마이그레이션

## 사전 확인 사항

- `package.json`에 `packageManager` 필드가 **없음** → `cache: "pnpm"` 유지 필요
- `pnpm/action-setup@v6`에서 `version` 파라미터 유지 필요 (또는 `packageManager` 필드 추가)

## 작업 목록

### 1. `.github/workflows/ci.yaml`

- [x] L20: `actions/checkout@v4` → `actions/checkout@v6`
- [x] L23: `pnpm/action-setup@v4` → `pnpm/action-setup@v6`
- [x] L28: `actions/setup-node@v4` → `actions/setup-node@v5`
- [x] `cache: "pnpm"` 은 유지 (packageManager 필드 없음)

### 2. `.github/workflows/deploy.yaml`

- [x] L20: `actions/checkout@v4` → `actions/checkout@v6`
- [x] L23: `pnpm/action-setup@v4` → `pnpm/action-setup@v6`
- [x] L28: `actions/setup-node@v4` → `actions/setup-node@v5`
- [x] `cache: "pnpm"` 은 유지 (packageManager 필드 없음)
- [x] L40: `actions/upload-pages-artifact@v3` → `actions/upload-pages-artifact@v5`
- [x] L57: `actions/deploy-pages@v4` → `actions/deploy-pages@v5`

### 3. `.github/workflows/claude-code-review.yml`

- [x] L24: `actions/checkout@v4` → `actions/checkout@v6`
- [x] `anthropics/claude-code-action@v1` 은 변경 불필요

### 4. `.github/workflows/claude.yml`

- [x] L29: `actions/checkout@v4` → `actions/checkout@v6`
- [x] `anthropics/claude-code-action@v1` 은 변경 불필요

## 변경 요약

각 파일에서 변경할 내용은 **버전 태그만 교체**하면 됩니다. 설정 옵션(`cache`, `version` 등)은 변경하지 않습니다.

| 찾기                               | 바꾸기                             |
| ---------------------------------- | ---------------------------------- |
| `actions/checkout@v4`              | `actions/checkout@v6`              |
| `pnpm/action-setup@v4`             | `pnpm/action-setup@v6`             |
| `actions/setup-node@v4`            | `actions/setup-node@v5`            |
| `actions/upload-pages-artifact@v3` | `actions/upload-pages-artifact@v5` |
| `actions/deploy-pages@v4`          | `actions/deploy-pages@v5`          |

## 검증

- [ ] PR 생성 후 CI 워크플로우 정상 실행 확인
- [ ] deprecation 경고 미발생 확인
- [ ] main 머지 후 deploy 워크플로우 정상 작동 확인
