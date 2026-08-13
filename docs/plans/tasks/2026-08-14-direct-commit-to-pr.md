# main 직접 커밋 → PR 전환

`main`에 PR 없이 직접 푸시된 두 커밋을 되돌리고, 각각 PR 흐름으로 다시 올리기 위한 작업 문서입니다.

## 대상 커밋

| 커밋      | 메시지                        | 처리 방향                                      |
| :-------- | :---------------------------- | :--------------------------------------------- |
| `b8011ef` | chore: format dependencies    | 독립 PR (`chore/format-dependencies`)          |
| `f5f2d69` | feat: create Header component | DS-02 작업 브랜치로 흡수 (`feat/ds-02-layout`) |

기준 커밋(되돌릴 지점)은 `e1a3431` — PR #20이 머지된 마지막 정상 상태입니다.

이 계획 문서 자체도 아직 커밋되지 않았으므로, 별도 docs PR로 분리해 올립니다.

```text
현재:  e1a3431 ── b8011ef ── f5f2d69  (main = origin/main)

목표:  e1a3431  (main)
         ├── (신규 문서)        → docs/plan-direct-commit-to-pr → PR
         ├── b8011ef            → chore/format-dependencies     → PR
         └── f5f2d69 (재적용)   → feat/ds-02-layout             → PR (DS-02, 드래프트)
```

PR 머지 순서는 `docs` → `chore` → `DS-02`입니다. 앞의 둘은 서로 독립적이고 작으므로 먼저 정리하고, DS-02는 작업이 끝날 때까지 드래프트로 열어둡니다.

## 사전 확인 사항

- `main` 브랜치 보호 설정 없음 → force-push 가능
- fork 0개, 열린 PR 0개 → 히스토리 재작성 영향 범위 없음
- 두 커밋이 건드린 파일이 겹치지 않음 → cherry-pick 충돌 없음

## 주의 사항

- `main`을 force-push 하는 순간 `deploy.yml`이 다시 돌면서, 배포된 사이트에서 Header가 사라집니다. DS-02 PR이 머지될 때까지 이 상태가 유지되며, **의도된 동작으로 합의된 사항**입니다.
- 히스토리를 재작성하지 않는 대안으로 `git revert` 두 번이 있지만, `main` 로그에 revert 커밋 2개 + 재적용 PR 2개가 남아 오히려 지저분해집니다. 1인 저장소이므로 force-push를 권합니다.
- `git reset --hard`는 추적되지 않는(untracked) 파일을 지우지 않습니다. 따라서 아직 커밋되지 않은 이 계획 문서는 2단계 리셋 후에도 작업 디렉토리에 그대로 남습니다. 다만 안전하게, 리셋 전인 1단계에서 먼저 커밋해둡니다.

---

## 1단계 — 브랜치 확보 (되돌리기 전에 먼저)

> **목표:** `main`을 리셋하기 전에 두 커밋을 각자의 브랜치에 안전하게 옮겨둡니다.

### 작업 목록

- [x] **1-1. 백업 태그 생성**

  되돌리기 전 현재 상태를 언제든 복구할 수 있게 표시해둡니다.

  ```bash
  git tag backup/pre-pr-rewrite main
  ```

- [x] **1-2. `chore/format-dependencies` 브랜치 생성**

  `b8011ef` 지점을 그대로 가리키게 만듭니다. 이 브랜치는 `e1a3431 + b8011ef`만 포함합니다.

  ```bash
  git branch chore/format-dependencies b8011ef
  ```

- [x] **1-3. `feat/ds-02-layout` 브랜치 생성 후 Header 커밋 재적용**

  `b8011ef`를 건너뛰고 `f5f2d69`만 얹어야 하므로 cherry-pick을 씁니다.

  ```bash
  git branch feat/ds-02-layout e1a3431
  git switch feat/ds-02-layout
  git cherry-pick f5f2d69
  ```

- [x] **1-4. `docs/plan-direct-commit-to-pr` 브랜치 생성 후 계획 문서 커밋**

  이 문서는 아직 untracked 상태이므로, 브랜치를 옮겨 다녀도 작업 디렉토리에 그대로 따라옵니다. 리셋 전에 커밋해 확정합니다.

  ```bash
  git switch -c docs/plan-direct-commit-to-pr e1a3431
  git add docs/plans/tasks/2026-08-14-direct-commit-to-pr.md
  git commit -m "docs(plans): add plan for converting direct commits to PRs"
  ```

- [x] **1-5. 세 브랜치 원격 푸시**

  ```bash
  git push -u origin docs/plan-direct-commit-to-pr
  git push -u origin chore/format-dependencies
  git push -u origin feat/ds-02-layout
  ```

---

## 2단계 — `main` 되돌리기

> **목표:** `main`을 `e1a3431` 상태로 되돌리고 원격에 반영합니다.

### 작업 목록

- [ ] **2-1. 로컬 `main` 리셋**

  ```bash
  git switch main
  git reset --hard e1a3431
  ```

- [ ] **2-2. 원격 `main` force-push**

  `--force-with-lease`는 내가 마지막으로 본 원격 상태와 다르면 거부합니다. 그냥 `--force`보다 안전하므로 이쪽을 씁니다.

  ```bash
  git fetch origin
  git push --force-with-lease origin main
  ```

- [ ] **2-3. 배포 워크플로 확인**

  Actions 탭에서 `deploy.yml`이 성공하는지 확인합니다. 이 시점의 사이트에는 Header가 없는 상태가 정상입니다.

---

## 3단계 — PR 생성

> **목표:** 세 변경을 각각 PR로 올려 CI와 리뷰를 통과시킵니다. 머지 순서는 `docs` → `chore` → `DS-02`입니다.

### 작업 목록

- [ ] **3-1. 계획 문서 PR 생성 및 머지**

  가장 작고 독립적이므로 먼저 정리합니다.

  ```bash
  git switch docs/plan-direct-commit-to-pr
  gh pr create --base main --title "docs(plans): add plan for converting direct commits to PRs" \
    --body "main에 직접 커밋된 2건을 PR 흐름으로 되돌리기 위한 작업 문서 추가."
  ```

- [ ] **3-2. `package-lock.json` 제거 (PR 올리기 전)**

  pnpm 프로젝트에 npm 락파일이 섞여 들어간 상태입니다. `chore/format-dependencies` 브랜치에서 정리합니다.

  ```bash
  git switch chore/format-dependencies
  git rm --cached package-lock.json
  rm package-lock.json
  ```

  `.gitignore`에 재유입 방지 규칙을 추가합니다.

  ```text
  # npm lockfile (this project uses pnpm)
  package-lock.json
  ```

  정리 내용을 커밋합니다.

  ```bash
  git add .gitignore
  git commit -m "chore: remove npm lockfile from pnpm project"
  git push
  ```

- [ ] **3-3. dependencies PR 생성 및 머지**

  ```bash
  gh pr create --base main --title "chore: format dependencies" \
    --body "@types/react 버전 명시 및 pnpm-lock.yaml 갱신. npm 락파일 유입분 제거."
  ```

  CI 통과 확인 후 머지합니다.

- [ ] **3-4. DS-02 브랜치를 최신 `main`에 리베이스**

  3-1과 3-3이 머지되면 `main`이 두 커밋만큼 앞서므로 맞춰줍니다.

  ```bash
  git switch feat/ds-02-layout
  git fetch origin
  git rebase origin/main
  git push --force-with-lease
  ```

- [ ] **3-5. DS-02 드래프트 PR 생성**

  Header 커밋이 첫 커밋이 되고, 이후 DS-02 나머지 작업(Check, Drawer, Footer, layout)을 같은 브랜치에 이어서 쌓습니다. 작업이 끝나면 `gh pr ready`로 드래프트를 해제합니다.

  ```bash
  gh pr create --draft --base main --title "feat: DS-02 · 레이아웃 & 헤더/푸터" \
    --body "$(cat <<'EOF'
  디자인 가이드 § 2단계 구현.

  - [x] 2-1. Header (진행 중)
  - [ ] 2-2. 모바일 햄버거 & Drawer
  - [ ] 2-3. Footer
  - [ ] 2-4. layout 루트 업데이트

  📎 상세: `docs/plans/tasks/2026-05-14-design-system-implementation.md` § 2단계
  EOF
  )"
  ```

---

## 4단계 — 정리

> **목표:** 잔여 브랜치와 태그를 치웁니다.

### 작업 목록

- [ ] **4-1. 머지 완료 브랜치 삭제**

  ```bash
  git branch -d docs/plan-direct-commit-to-pr
  git branch -d chore/format-dependencies
  ```

  `feat/ds-02-layout`은 DS-02가 끝날 때까지 유지합니다.

- [ ] **4-2. 이미 머지된 로컬 브랜치 정리**

  `worktree-refactor-project-plans`는 PR #19로 머지 완료된 잔여 브랜치입니다.

  ```bash
  git branch -D worktree-refactor-project-plans
  ```

- [ ] **4-3. 백업 태그 삭제**

  모든 PR이 정상 머지되고 배포가 확인된 뒤에 지웁니다.

  ```bash
  git tag -d backup/pre-pr-rewrite
  ```

---

## 복구 방법

중간에 잘못되면 1-1에서 만든 태그로 원상복구할 수 있습니다.

```bash
git switch main
git reset --hard backup/pre-pr-rewrite
git push --force-with-lease origin main
```
