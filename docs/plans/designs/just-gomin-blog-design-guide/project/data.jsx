// data.jsx — fake content for the prototype
const NOTES = [
  {
    id: "claude-md-as-context",
    when: "2026.04.28",
    where: "@HOME",
    title: "CLAUDE.md 를 컨텍스트 엔지니어링의 도구로 쓰는 법",
    tags: ["AI", "Claude", "PracticalNote"],
    summary: "에이전트와의 협업에서 반복되는 결정들을 어떻게 줄일 수 있을까. 한 달 간 실험한 기록.",
  },
  {
    id: "done-is-better",
    when: "2026.04.11",
    where: "@OFFICE",
    title: "완성된 것이 완벽한 것보다 낫다 — 다시 한 번",
    tags: ["Mindset", "Essay"],
    summary: "Done is better than perfect. 이 말의 의미를 매년 다시 새기고 있다.",
  },
  {
    id: "obsidian-naver-map",
    when: "2026.03.22",
    where: "@CAFE",
    title: "Obsidian 과 Naver Map 으로 시간·장소·사람 묶기",
    tags: ["Productivity", "Obsidian", "Workflow"],
    summary: "시간, 장소, 사람을 한 그래프로 연결하는 개인 시스템에 대한 메모.",
  },
  {
    id: "product-engineer-2y",
    when: "2026.02.14",
    where: "@OFFICE",
    title: "Product Engineer 2년 차의 회고",
    tags: ["Retro", "Career"],
    summary: "beyo 에서 보낸 두 해. 무엇을 배우고, 무엇을 더 배워야 하는가.",
  },
  {
    id: "dart-rest",
    when: "2026.01.30",
    where: "@HOME",
    title: "Dart 로 REST API 서버를 직접 만들면 보이는 것들",
    tags: ["Dart", "Backend", "DeepDive"],
    summary: "shelf 위에 NestJS-스러운 패턴을 얹어보는 사이드 프로젝트.",
  },
  {
    id: "reading-writing-organizing",
    when: "2025.12.18",
    where: "@LIBRARY",
    title: "읽고, 쓰고, 정리하기 — 세 동사로 일하기",
    tags: ["Mindset", "Workflow"],
    summary: "지난 1년 간 일에서 가장 큰 변화를 가져왔던 세 가지 동작.",
  },
  {
    id: "monospace-typography",
    when: "2025.11.05",
    where: "@CAFE",
    title: "모노스페이스 타이포그래피로 만든 블로그가 주는 감각",
    tags: ["Design", "Typography"],
    summary: "본 블로그를 모노스페이스로 디자인하면서 발견한 것들에 대한 짧은 기록.",
  },
  {
    id: "rebuild-jeju",
    when: "2025.10.21",
    where: "@JEJU",
    title: "제주에서 일주일, 그리고 다시 시작하기",
    tags: ["Essay", "Travel"],
    summary: "코드를 모두 닫고 일주일을 보냈다. 돌아왔을 때 가장 먼저 한 일은.",
  },
  {
    id: "mdx-components",
    when: "2025.09.08",
    where: "@HOME",
    title: "MDX 커스텀 컴포넌트로 글의 어휘 늘리기",
    tags: ["Design", "MDX", "Web"],
    summary: "글이라는 매체에 새로운 단어를 추가하는 방법.",
  },
  {
    id: "git-branch-naming",
    when: "2025.08.17",
    where: "@OFFICE",
    title: "git branch 이름 짓기의 사소한 행복",
    tags: ["Git", "Practice"],
    summary: "팀과의 약속, 미래의 나와의 약속.",
  },
];

const TAGS = (() => {
  const counts = {};
  NOTES.forEach((n) => n.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
})();

const CAREER = [
  {
    role: "PRODUCT ENGINEER",
    company: "beyo",
    period: "2024 ~ 2026",
    items: [
      {
        header: "AI-based MVP factory",
        lines: [
          "AI 에이전트로 MVP 를 자동 생성하는 파이프라인 설계",
          "Flutter boilerplate, Slack bot, Dart 패키지를 묶는 워크플로우",
          "사내 PE 들의 평균 MVP 제작 시간을 8h → 1.5h 로 단축",
        ],
      },
      {
        header: "Dart 기반 백엔드 프레임워크",
        lines: [
          "NestJS 스타일의 REST API 패키지 'just_rest_api_dart' 개발",
          "사내 서비스 4개 마이그레이션, OSS 로 공개",
          "타임 동기화 패키지 'tictoc' 함께 메인테인",
        ],
      },
    ],
  },
  {
    role: "SOFTWARE ENGINEER",
    company: "imimtu",
    period: "2022 ~ 2024",
    items: [
      {
        header: "Runners-Hi · Brick 서비스 개발",
        lines: [
          "Flutter / Spring 기반 To-do 서비스 백엔드와 앱 동시 운영",
          "Notion · Naver Calendar · Google Calendar 양방향 동기화",
          "CI/CD 파이프라인 자체 구축 (GitHub Actions + AWS)",
        ],
      },
    ],
  },
  {
    role: "STUDENT · OPEN SOURCE",
    company: "Just-gomin",
    period: "2018 ~ 2022",
    items: [
      {
        header: "오픈소스 기여 · 학습 기록",
        lines: [
          "Flutter · Dart 생태계 패키지 다수 메인테인",
          "tech-interview · Interview_Question_for_Beginner 등 학습용 포크 운영",
          "개인 블로그 thumbnail generator · 자동화 도구 제작",
        ],
      },
    ],
  },
];

const PROFILE_COLS = [
  { key: "name", val: "안강민" },
  { key: "born", val: "1995" },
  { key: "email", val: "just0gomin@gmail.com" },
  { key: "job", val: "Product Engineer" },
  { key: "tools", val: "[ Notion,\n  Obsidian,\n  Naver Map ]" },
  { key: "interest", val: "[ 시간, 장소,\n  사람, 기록,\n  연결 ]" },
];

const SLOGANS = [
  { en: "Done is better than perfect.",            ko: "완성된 것이 완벽한 것보다 낫다." },
  { en: "Read, Write, and Organize.",              ko: "읽고, 쓰고, 정리하기." },
  {
    en: "Working on beyo as Product Engineer now.",
    ko: "beyo 에서 Product Engineer 로 근무하고 있습니다.",
    segments: [
      { text: "Working on " },
      { text: "beyo", href: "https://beyo.io", external: true },
      { text: " as " },
      { text: "Product Engineer", href: "/notes?tag=Career" },
      { text: " now." },
    ],
  },
];

Object.assign(window, { NOTES, TAGS, CAREER, PROFILE_COLS, SLOGANS });
