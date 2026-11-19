---
name: lore-sync
description: 코드를 바꾼 뒤 lore 스펙이 코드와 어긋났을 때 스펙의 경로와 본문을 지금 코드에 맞게 고친다. lore check가 스펙 동반 갱신을 경고하거나 경로 유효성이 실패했을 때, 파일을 옮기거나 이름을 바꾼 뒤, lore 없이 끝난 작업을 메울 때 쓴다.
metadata:
  lore-hash: 1e5471e39bcf67afd23478265f281c7feeac39128a23107b7684cf6203896346
---

# lore 스펙 맞추기

바뀐 코드에 맞춰 `docs/specs/`의 스펙을 고칩니다. 결정 기록은 만들지 않습니다. 코드만 보고는 이유를 알 수 없기 때문입니다.

## 1. 비교 기준 정하기

PR이 병합될 브랜치를 기준으로 씁니다. 보통 `origin/main`입니다. 커밋하지 않은 변경도 비교 범위에 들어갑니다. 파일을 옮겼다면 `git mv`로 옮기거나 새 경로를 `git add`해야 이름 변경으로 잡힙니다.

## 2. 고칠 내용 보기

```sh
lore sync --base origin/main --dry-run
```

출력에는 세 가지가 있습니다.

- `fixed`: 이름이 바뀐 파일을 글자 그대로 가리키던 `paths`, `tests` 항목. `lore sync`가 새 경로로 고칩니다.
- `to_check`: `lore sync`가 고치지 않는 항목.
  - `reason`이 `glob`이면 글롭에 맞던 파일이 글롭 밖으로 옮겨졌습니다. 새 경로를 맡을 스펙의 `paths`나 `tests`에 더하고, 글롭에 맞는 파일이 더는 없으면 그 글롭을 지웁니다.
  - `reason`이 `unsupported_format`이면 목록의 모양 때문에 고치지 못했습니다. 머리말을 직접 고칩니다.
- `specs_to_review`: 바뀐 파일이 닿지만 본문이 바뀌지 않은 스펙. 4절에서 봅니다.

## 3. 경로 고치기

```sh
lore sync --base origin/main
```

머리말의 해당 항목만 바뀌고 나머지 글자와 주석은 그대로입니다. `to_check`의 항목은 2절대로 직접 고칩니다.

## 4. 본문 고치기

`specs_to_review`의 스펙마다 `files`에 나온 파일의 변경을 읽습니다. 커밋하지 않은 변경까지 보도록 merge-base와 지금 작업 트리를 견줍니다. 이름이 바뀐 파일은 `files`에 원래 경로로 나오므로, 첫 명령에서 새 경로를 찾아 함께 넣습니다.

```sh
git diff -M --stat "$(git merge-base origin/main HEAD)"
git diff -M "$(git merge-base origin/main HEAD)" -- <파일 경로> <새 경로>
```

스펙 본문에서 이번 변경으로 틀리게 된 문장만 고칩니다.

- 동작이 바뀌었으면 "지금 동작"의 문장을 고칩니다. "아직 동작하지 않는 것"에 있던 항목이 이제 동작하면 "지금 동작"으로 옮기고, 기능을 없앴으면 항목을 지웁니다. 절이 비면 절도 지웁니다.
- 본문에 파일 이름이나 경로가 적혀 있고 그 파일을 옮겼으면 고칩니다.
- 코드에 없는 동작을 짐작해 적지 않습니다. 확신이 없으면 고치지 않고 사람에게 묻습니다.
- 리팩터링처럼 동작이 그대로라 고칠 문장이 없으면 본문을 고치지 않습니다. 대신 PR 설명에 아래 줄을 적어 `lore check`의 스펙 동반 갱신 경고를 넘깁니다.

```text
lore: no-impact <스펙 ID> <사유>
```

변경에 "왜"가 있었다면, 예를 들어 둘 이상의 방법 중 하나를 골랐다면, 스펙 본문에 이유를 쓰지 않고 `lore-record` 스킬로 결정 기록을 따로 남깁니다.

## 5. 확인

```sh
lore build
lore check --base origin/main
```

`lore build`로 `docs/INDEX.md`를 다시 만들고, `lore check`에서 실패가 없는지, 남은 경고가 `no-impact`로 넘길 것뿐인지 확인합니다. 고친 스펙과 인덱스를 코드와 같은 PR에 넣습니다.
