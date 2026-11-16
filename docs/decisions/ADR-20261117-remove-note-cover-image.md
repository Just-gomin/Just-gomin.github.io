---
id: ADR-20261117-remove-note-cover-image
title: 쓰지 않는 Note.coverImage 필드를 없앤다
status: accepted # proposed | accepted
specs: [note]
sources: []
confidence: inferred # stated | inferred
---

## 배경

`features/note/types.ts`의 `Note` 타입에는 노트의 대표 이미지 URL을 뜻하는 `coverImage?: string`이 선언되어 있었습니다. 그러나 이 값을 넣는 곳도 읽는 곳도 없었습니다. `meta.json`에도 해당 항목이 없고, 노트 목록, 본문, 오픈 그래프 어디에서도 쓰지 않았습니다. 스펙 `note`는 이 필드를 "아직 동작하지 않는 것"으로 적어 두었습니다.

또 노트의 메타데이터는 `meta.json`(`NoteMeta`)에 두기로 했는데(`ADR-20261113-note-meta-json`), 이 필드는 `NoteMeta`가 아니라 `Note`에만 있어 그 결정과도 어긋났습니다.

## 결정

`Note` 타입에서 `coverImage` 필드를 없앱니다. 어디서도 값을 넣거나 읽지 않는 필드가 남아 있으면 노트에 대표 이미지가 있는 것처럼 보여 오해를 부르기 때문입니다. 대표 이미지가 필요해지면 `meta.json`의 항목으로 다시 설계합니다.

이 이유는 레포 주인이 선택을 맡긴 어시스턴트 팀이 제시했고, 레포 주인이 진행을 승인했습니다. 레포 주인이 직접 밝힌 말이 아니라서 `confidence: inferred`로 둡니다.

## 검토한 대안

- 지금 구현하기: `meta.json`에서 이미지 경로를 읽어 오픈 그래프 이미지로 쓰는 방법입니다. 아직 이미지가 있는 노트가 없고, 이미지를 어디에 두고 크기를 어떻게 맞출지 정하지 않아 고르지 않았습니다.

## 결과와 감수한 비용

- 노트에 대표 이미지를 붙이려면 `NoteMeta`와 `meta.json`에 항목을 새로 설계해야 합니다. 그때 이미지 보관 위치와 크기 규칙도 함께 정해야 합니다.
- 동작은 바뀌지 않습니다. 타입 선언만 줄어듭니다.
