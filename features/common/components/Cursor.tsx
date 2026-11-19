type CursorProps = {
  /** 강조 색으로 그립니다. 기본은 글자 색입니다. */
  accent?: boolean;
};

/** 깜박이는 블록 커서. */
export function Cursor({ accent = false }: CursorProps) {
  return (
    <span className={accent ? "cursor accent" : "cursor"} aria-hidden="true" />
  );
}
