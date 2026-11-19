---
name: lore-source
description: 사람이 알려 준 대화, 문서, 회의 자료 같은 원본을 정제해 lore 소스 노트로 등록한다. 설계 단계에서 "이 요청과 관련된 대화나 자료가 있나요?"에 자료가 있다는 답을 받았을 때 쓴다.
metadata:
  lore-hash: 6ba6cd14029f434db98bbd2600364af5306de5d3013d59c98c1b056184cbcc77
---

# lore 소스 노트 정제

원본은 레포에 복사하지 않습니다. 결정에 영향을 준 내용만 뽑아 소스 노트로 남기고, 원본은 링크로 가리킵니다.

## 1. 채널과 등급 확인

자료가 어느 채널에서 왔는지 정하고 `lore.config.yaml`의 `channels`에서 등급을 찾습니다.

- `excluded`: 읽지 않습니다. 이 자료는 쓸 수 없다고 사람에게 알리고 멈춥니다.
- `sensitive` 또는 설정에 없는 채널: 내용을 읽지 않습니다. 제목과 원본 링크만으로 입력을 만들고 `body`는 뺍니다. 파일이면 추출기도 부르지 않고, 원본 링크와 `origin_version`은 2절의 "원본 링크"대로 정합니다. 제목과 날짜는 파일 이름과 사람의 답으로 채웁니다.
- `normal`: 파일이면 2절, 대화나 문서면 3절로 갑니다.

## 2. 파일을 받았을 때

사람이 내보낸 파일(사진, 엑셀, 메모)을 받으면 추출기로 원문을 얻습니다.

- **원본 링크**: 파일은 레포에 넣지 않습니다. 파일의 sha256으로 이미 등록한 소스 노트가 있는지 찾아, 있으면 그 노트의 `origin`을 씁니다. 없으면 지정된 Drive 폴더에 Google 문서로 변환하지 않고 올린 뒤 그 링크를 씁니다. 이 sha256이 소스 노트의 `origin_version`이 됩니다.

  ```sh
  h=$(shasum -a 256 < board.jpg | cut -c1-64)
  grep -rlF "$h" docs/sources/
  ```

- **추출기 찾기**: 파일 확장자를 소문자로 바꿔 `lore.config.yaml`의 `extractors`에서 `extensions`에 든 추출기를 찾습니다. 실행 파일이 있는지는 `command -v lore-extractor-image`처럼 봅니다.
- **추출기 실행**: 입력 JSON을 표준 입력으로 넘깁니다. `file`, `channel`, `origin`은 꼭 넣고, `kind`, `title`, `occurred_at`은 알면 넣습니다. 이미지는 `lang`(기본 `kor+eng`), 엑셀은 `max_rows`(기본 500)를 더 받고, 그 밖의 항목은 `invalid_input`입니다. 아래는 `meeting` 채널이 `normal`로 등록된 레포의 예입니다.

  ```sh
  echo '{"file": "board.jpg", "channel": "meeting", "origin": "https://drive.google.com/file/d/board", "kind": "discussion"}' | lore-extractor-image
  ```

- **결과 읽기**: 출력의 `candidates[0]`이 후보이고, `text`가 정제하기 전 원문입니다. 실패해도 오류는 표준 출력의 `{"ok": false, "error": {"code": ..., "message": ...}}`로 나오므로, 종료 코드가 0이 아니어도 `error.code`를 봅니다.
  - `occurred_at_missing`: 파일에서 날짜를 찾지 못했습니다. 사람에게 회의나 문서의 날짜를 묻고 `occurred_at`을 넣어 다시 부릅니다.
  - `invalid_input`: 입력 JSON을 고쳐 다시 부릅니다.
  - `io`, `unreadable_file`: 파일을 읽지 못했거나 형식이 맞지 않습니다(확장자만 `.jpg`인 HEIC 사진 등). 파일을 직접 읽습니다.
  - `tool_missing`, `tool_failed`(이미지): 메시지의 설치 방법을 사람에게 알리고, 그림을 직접 볼 수 있으면 직접 읽습니다.
  - 엑셀의 날짜는 마지막으로 저장한 날입니다. 회의한 날과 같은지 사람에게 확인합니다.
  - 이미지의 `text`는 글자 인식 결과라 틀린 글자가 있을 수 있습니다. 그림을 직접 볼 수 있으면 인식한 글과 함께 보고 정제합니다. 도표와 화살표의 뜻도 그림에서 읽습니다.
- **추출기가 없을 때**: 설정에 `extractors`가 없거나(이전 판으로 설치한 레포), 등록된 추출기가 없는 형식(HEIC 사진 등)이거나, 실행 파일이 없으면 지금처럼 파일을 직접 읽습니다. 실행 파일은 lore 릴리스의 `lore-extractor-<이름>-<타깃>.tar.gz`에 있다고 알립니다.

입력 JSON을 만들 때는 후보에서 `text`를 빼고, 3절대로 정제한 `body`와 `slug`를 더합니다.

## 3. 정제

전체를 요약하지 않고 결정에 영향을 준 내용을 뽑습니다.

- **담는 것**: 무엇을 요구했는지, 무엇에 합의했는지, 언제였는지, 누구의 역할에서 나온 말인지
- **빼는 것**: 결정과 무관한 내용, 개인정보, 레포에 두면 안 되는 기밀. 사람 이름 대신 역할을 씁니다.
- **독립성**: 원본 링크가 끊기거나 권한이 없어도 결정의 근거를 이해할 수 있을 만큼 적습니다.

## 4. 입력 JSON

```json
{
  "title": "재시도 횟수 상향 요청",
  "slug": "retry-count",
  "kind": "discussion",
  "channel": "kakaotalk",
  "origin": "https://drive.google.com/file/d/retry-count",
  "origin_version": "2026-11-10T14:02:00+09:00",
  "occurred_at": "2026-11-10",
  "body": "- 운영 담당이 야간 정산 시간대에 3회 재시도로는 실패가 남는다고 알림\n- 5회까지 늘려 달라고 요청\n"
}
```

- `kind`: `discussion`(대화, 회의), `client-doc`(고객 문서), `evidence`(작업 착수 증거), `reference`(참고자료)
- `origin`: 원본의 링크입니다. 링크가 없는 파일은 지정된 Drive 폴더에 올린 뒤 그 링크를 씁니다.
- `origin_version`: 원본의 해시나 수정 시각입니다. 원본이 바뀌었는지 판단할 때 씁니다.
- `occurred_at`: 논의나 문서가 만들어진 날입니다.

## 5. 등록

입력을 파일로 저장하고 넘깁니다.

```sh
lore add source --from source.json
```

출력의 `change`가 `unchanged`면 같은 판의 원본이 이미 등록되어 있다는 뜻입니다. `sensitivity`가 `sensitive`면 본문은 저장되지 않았습니다.

## 6. 연결

- 이 자료를 근거로 내린 결정의 `--sources`에 출력의 `id`를 넣습니다.
- 입력 JSON 파일은 레포에 커밋하지 않습니다.
- `lore build`로 `docs/INDEX.md`를 다시 만듭니다.
