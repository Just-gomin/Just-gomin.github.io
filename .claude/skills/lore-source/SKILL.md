---
name: lore-source
description: 사람이 알려 준 대화, 문서, 회의 자료 같은 원본을 정제해 lore 소스 노트로 등록한다. 설계 단계에서 "이 요청과 관련된 대화나 자료가 있나요?"에 자료가 있다는 답을 받았을 때 쓴다.
metadata:
  lore-hash: 4edad3005aeeb9663154a73afe3f1225391c14879b43a5079eb03946e62bea58
---

# lore 소스 노트 정제

원본은 레포에 복사하지 않습니다. 결정에 영향을 준 내용만 뽑아 소스 노트로 남기고, 원본은 링크로 가리킵니다.

## 1. 채널과 등급 확인

자료가 어느 채널에서 왔는지 정하고 `lore.config.yaml`의 `channels`에서 등급을 찾습니다.

- `excluded`: 읽지 않습니다. 이 자료는 쓸 수 없다고 사람에게 알리고 멈춥니다.
- `sensitive` 또는 설정에 없는 채널: 내용을 읽지 않습니다. 제목과 원본 링크만으로 입력을 만들고 `body`는 뺍니다.
- `normal`: 다음 절대로 정제합니다.

## 2. 정제

전체를 요약하지 않고 결정에 영향을 준 내용을 뽑습니다.

- **담는 것**: 무엇을 요구했는지, 무엇에 합의했는지, 언제였는지, 누구의 역할에서 나온 말인지
- **빼는 것**: 결정과 무관한 내용, 개인정보, 레포에 두면 안 되는 기밀. 사람 이름 대신 역할을 씁니다.
- **독립성**: 원본 링크가 끊기거나 권한이 없어도 결정의 근거를 이해할 수 있을 만큼 적습니다.

## 3. 입력 JSON

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

## 4. 등록

입력을 파일로 저장하고 넘깁니다.

```sh
lore add source --from source.json
```

출력의 `change`가 `unchanged`면 같은 판의 원본이 이미 등록되어 있다는 뜻입니다. `sensitivity`가 `sensitive`면 본문은 저장되지 않았습니다.

## 5. 연결

- 이 자료를 근거로 내린 결정의 `--sources`에 출력의 `id`를 넣습니다.
- 입력 JSON 파일은 레포에 커밋하지 않습니다.
- `lore build`로 `docs/INDEX.md`를 다시 만듭니다.
