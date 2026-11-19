# AGENTS.md

이 레포에서 일하는 에이전트가 가장 먼저 읽는 문서입니다.

## 이 레포의 규칙

- 학습용 개인 블로그입니다.
- 명령: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`(Vitest).
- 정적 내보내기(`output: "export"`)로 GitHub Pages에 배포합니다.

## 레포 구조

| 경로                    | 내용                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| `app/`                  | Next.js 라우트. `/`, `/notes`, `/notes/[slug]`, `/resume`               |
| `features/note/`        | 노트 목록과 본문. 타입, `content/notes` 읽기, 목록과 태그 필터 컴포넌트 |
| `features/resume/`      | 이력서. 아직 자리만 있습니다                                            |
| `features/common/`      | 여러 기능이 함께 쓰는 상수와 내비게이션                                 |
| `content/notes/<slug>/` | 노트 한 편. `index.mdx`와 `meta.json`                                   |
| `mdx-components.tsx`    | MDX 요소별 렌더링과 코드 하이라이트                                     |
| `public/`               | 정적 파일                                                               |
| `docs/INDEX.md`         | 모든 기록의 한 줄 목록                                                  |
| `docs/specs/`           | 기능 스펙. 기능이 지금 어떻게 동작하는지. `lore add spec`으로 만듭니다  |
| `docs/decisions/`       | 결정 기록. 왜 그렇게 만들었는지                                         |
| `docs/incidents/`       | 사고 기록                                                               |
| `docs/sources/`         | 소스 노트. 원본 자료를 정제한 요약과 원본 링크                          |
| `.claude/skills/`       | lore 스킬. `lore install`이 관리합니다                                  |
| `docs/plans/`           | lore 도입 전의 계획 문서. `plans` 채널의 원본입니다                     |
| `lore.config.yaml`      | 채널, 민감도 등급, 분석 설정                                            |

<!-- lore:begin v1 -->

## lore로 작업하기

코드를 왜 이렇게 만들었는지는 `docs/`에 기록되어 있고, 그 기록을 다루는 도구가 `lore`입니다. 이 구간은 `lore install`이 관리합니다. 직접 고치지 말고, 프로젝트마다 다른 내용은 구간 밖에 적습니다.

### 원칙

1. 설계하기 전에 묻습니다. 고치려는 코드에 얽힌 결정과 사고를 먼저 확인합니다.
2. 사람의 승인은 두 번 받습니다. 설계와 영향 범위를 승인받은 뒤 구현하고, PR에서 코드와 기록을 함께 승인받습니다.
3. 코드를 바꾸면 기록도 같은 PR에서 바꿉니다.
4. 기존 결정 기록은 고치지 않습니다. 결정이 바뀌면 새 결정을 쓰고 `supersedes`로 옛 결정을 가리킵니다.
5. 모르는 이유는 지어내지 않습니다. 근거를 찾지 못하면 "이유 불명"이라고 적고 `confidence: inferred`로 표시합니다.

### 1. 맥락 확인

고칠 파일이나 기능이 정해지면 먼저 조회합니다.

```sh
lore why <파일 경로 | ID>
lore impact <파일 경로 | ID> --hop=2
```

`lore why`는 요약 목록부터 읽고, 필요한 기록만 `--depth doc`, 원본까지 필요하면 `--depth source`로 내려갑니다. `lore impact`의 홉은 기능 사이를 건너는 횟수이며, 대상에 기대는(대상을 `depends_on`으로 가리키는) 기능 쪽으로 넓힙니다. 대상이 기대는 기능은 나오지 않습니다. 모든 명령은 JSON을 출력합니다. 사람에게 보여줄 때만 `--for-human`을 붙입니다.

### 2. 관련 자료 묻기

설계를 시작하기 전에 사람에게 묻습니다.

> 이 요청과 관련된 대화나 자료가 있나요?

자료가 있으면 내용을 정제해 입력 JSON으로 만들고 소스 노트로 등록합니다.

```sh
lore add source --from <JSON 파일>
```

입력 JSON에는 `title`, `slug`(영문), `kind`, `channel`, `origin`, `origin_version`, `occurred_at`, `body`를 넣습니다. `channel`은 `lore.config.yaml`의 채널 `id`와 같아야 합니다. 민감 채널은 `body`를 빼고 넘깁니다.

정제 기준과 입력 예시는 `lore-source` 스킬(`.claude/skills/lore-source/SKILL.md`)에 있습니다.

### 3. 설계 승인

설계안에 다음을 담아 사람에게 승인을 요청합니다.

- 무엇을 어떻게 바꾸는지
- `lore impact`가 알려준 영향 범위: 기능, 파일, 테스트
- 기존 결정과 충돌하는지, 충돌하면 어느 결정을 대체하는지

승인 전에는 구현하지 않습니다.

### 4. 구현과 테스트

승인받은 범위 안에서 구현하고 테스트합니다. 범위를 벗어나야 하면 멈추고 다시 승인을 받습니다.

### 5. 기록

이 작업으로 새로 정한 것이 있으면 결정 기록을 추가합니다.

무엇을 기록하고 어떻게 채우는지는 `lore-record` 스킬(`.claude/skills/lore-record/SKILL.md`)에 있습니다. 스킬을 불러올 수 없는 에이전트는 그 파일을 직접 읽고 따릅니다.

```sh
lore add decision --slug <영문 슬러그> --title <제목> --specs <스펙 ID>    # 새 결정
lore add decision --slug <영문 슬러그> --title <제목> --supersedes <ID>   # 기존 결정을 대체
lore add incident --slug <영문 슬러그> --title <제목> --specs <스펙 ID>   # 사고
lore build                                                              # 본문을 채운 뒤
```

- 결정 기록은 그 문서만 읽어도 이유를 알 수 있게 씁니다. 배경, 결정, 검토한 대안, 결과와 감수한 비용을 채웁니다.
- 관계는 가리키는 쪽 파일에만 적습니다. 결정의 `specs`, `supersedes`, `sources`, 사고의 `specs`, `decisions`, `sources`입니다.
- `--supersedes`를 쓰면 본문을 고쳐야 할 스펙이 `specs_to_review`로 출력됩니다. 그 스펙 본문을 지금 동작에 맞게 고칩니다.
- 본문을 채우고 새 파일을 `git add`한 뒤 `lore build`로 `docs/INDEX.md`를 다시 만듭니다. 스펙의 `paths`, `tests`는 git이 추적하는 파일에만 맞춥니다.
- 동작이 바뀌었으면 해당 스펙 본문도 고칩니다.

### 6. PR과 검사

코드와 `docs/` 변경을 한 PR에 담습니다. PR을 올리기 전에 검사합니다. CI도 PR마다 같은 검사를 PR 설명과 함께 돌려 결과를 PR 코멘트로 남깁니다.

```sh
lore check --base origin/main
lore check --base origin/main --pr-body <PR 설명 파일>   # no-impact 줄까지 반영
```

- **실패**: 경로 유효성, 참조 유효성, 머리말 형식, 인덱스 일치, 안내문 일치, 소스 노트 신선도(원본의 최신 판 목록을 `--origins`로 줄 때만). 레포가 lore 검사를 필수 상태 검사로 등록했으면 병합할 수 없습니다. 출력의 `fix`대로 고칩니다.
- **경고는 병합을 막지 않습니다**: 스펙 동반 갱신, 매핑 누락. 경고마다 처리를 기록해 나중에 차단할지 정합니다.
  - 스펙 동반 갱신: 바뀐 코드가 속한 스펙의 본문이 같은 PR에서 바뀌지 않았습니다. 머리말(`paths`, `tests`)만 고쳐서는 풀리지 않습니다. 스펙 본문을 고치거나, 동작이 그대로라 고칠 문장이 없으면 PR 설명에 `lore: no-impact <스펙 ID> <사유>` 한 줄을 적습니다.
  - 매핑 누락: 새 파일이 어떤 스펙의 `paths`, `tests`에도 맞지 않습니다. 맡을 스펙에 더하고, 코드가 아니면 `lore.config.yaml`의 `check.ignore`에 더합니다.

파일을 옮겼거나 `lore` 없이 코드를 바꿔 스펙이 어긋났으면 `lore-sync` 스킬(`.claude/skills/lore-sync/SKILL.md`)을 따릅니다.

```sh
lore sync --base origin/main
```

### 하지 않는 것

- `docs/INDEX.md`를 손으로 고치지 않습니다. 충돌하면 `lore build`로 다시 만듭니다.
- 디비 파일을 커밋하지 않습니다. 디비는 소스에서 다시 만들 수 있는 빌드 산출물이며, 조회할 때 `.lore/`에 자동으로 만들어지고 git이 무시합니다.
- 민감 등급 채널의 내용을 소스 노트나 결정 기록에 옮겨 적지 않습니다. 제목과 링크만 남기고, 결정의 이유는 구체적인 내용을 일반화해서 씁니다.
- 제외 등급 채널은 읽지 않습니다.

<!-- lore:end -->
