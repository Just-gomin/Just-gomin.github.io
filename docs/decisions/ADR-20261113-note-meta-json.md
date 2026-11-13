---
id: ADR-20261113-note-meta-json
title: 노트의 메타데이터를 본문과 분리해 meta.json에 둔다
status: accepted # proposed | accepted
specs: [note]
sources: [https://github.com/Just-gomin/Just-gomin.github.io/pull/21]
confidence: stated # stated | inferred
---

## 배경

노트 목록과 오픈 그래프 메타데이터는 제목, 날짜, 설명, 태그만 있으면 됩니다. 이 값이 본문 파일 안에 있으면 목록 한 줄을 그릴 때도 본문 전체를 다뤄야 합니다.

## 결정

노트 한 편의 메타데이터는 `content/notes/<slug>/meta.json`에, 본문은 같은 폴더의 `index.mdx`에 둡니다. 목록 표기와 오픈 그래프처럼 메타데이터만 필요한 곳이 가볍게 동작하도록 하기 위해서입니다.

## 검토한 대안

- MDX 파일 머리의 frontmatter에 메타데이터를 두는 방법. PR 리뷰에서 비교 대상으로 나온 것이며, 결정 당시 실제로 검토했는지는 기록이 없습니다.

## 결과와 감수한 비용

- 노트 한 편을 쓸 때 파일을 둘 만들어야 합니다.
- 이 결정은 코드가 만들어진 뒤에 기록했습니다. 결정한 시점은 이 문서의 날짜보다 앞섭니다.
