# Just-gomin.github.io Claude.md

## Markdown 작성 주의 사항

### List 사용

목록의 제목과 내용을 연속된 줄에 작성하지 않습니다.

```markdown
<!-- BAD -->

### TITLE

- CONTENT

<!-- GOOD -->

### TITLE

- CONTENT
```

### Codeblock 사용

적절한 언어가 없다면 기본으로 `text` codeblock으로 작성합니다.

````markdown
  <!-- BAD -->

\```

    ...

\```

  <!-- GOOD -->

\```text

    ...

\```
````

### Header는 Header Syntax를 사용할 것

- Emphasis(\*\*)를 Header로 사용하는 경우가 더러 있는데, Header는 Header Syntax(`#`)를 사용합니다.
- `#` 은 파일의 전체 제목으로 파일에서 유일무이 해야합니다.
- `##` ~ `######`까지를 헤더로 사용합니다.

```markdown
<!-- BAD -->

** header **

-
-
-

<!-- GOOD -->

### header

-
-
-
```

#### 예외

- Emphasis(\*\*)을 헤더로 허용하는 경우는, Header6(`######`) 까지 사용한 뒤 세부 내용이 필요한 경우에 한합니다.

## Work Myself

- 웹 프론트엔드 개발자를 준비하기 위해 `JavaScript`, `TypeScript`, `React`, `Next.js`, `Tailwind CSS` 에 대한 학습을 진행하고자 합니다.
- 실제 작업은 제가 진행하겠습니다.
- 작업을 직접 수행하기 보다, 제가 무엇을 해야할지 작업에 대한 설명을 제공해주세요.
  - 예를 들어, 함수를 직접 구현하는 것이 아닌 함수 명을 추천하고 어떤 동작을 해야할지 설명해주는 형태 입니다.
- 해당 프로젝트의 기본 `output-style`을 `learning` 으로 염두하겠습니다. 다른 옵션으로 설정된 경우엔 알려주세요.
