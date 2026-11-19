type AsciiDividerProps = {
  /** 있으면 `── label ──`처럼 가운데에 라벨을 둡니다. */
  label?: string;
};

/** `─ ─ ─` 글자로 그린 구분선. */
export function AsciiDivider({ label }: AsciiDividerProps) {
  if (label) {
    return (
      <div className="ascii-divider-label">
        <span className="line" />
        <span className="label">{label}</span>
        <span className="line" />
      </div>
    );
  }
  return <div className="ascii-divider" aria-hidden="true" />;
}
