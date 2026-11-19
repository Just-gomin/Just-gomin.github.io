type TagProps = {
  label: string;
  /** 태그가 붙은 글의 수. 있으면 라벨 뒤에 옅게 보여 줍니다. */
  count?: number;
  active?: boolean;
  /** 없으면 누를 수 없는 버튼입니다. */
  onClick?: () => void;
};

/** `#label`꼴 태그. 선택되면 앞에 `x`를 붙이고 강조 색으로 보여 줍니다. */
export function Tag({ label, count, active = false, onClick }: TagProps) {
  return (
    <button
      type="button"
      className={active ? "tag is-active" : "tag"}
      aria-pressed={active}
      disabled={!onClick}
      onClick={onClick}
    >
      <span className="check" aria-hidden="true">
        {active ? "x " : ""}
      </span>
      <span>#{label}</span>
      {count !== undefined && <span className="count">{count}</span>}
    </button>
  );
}
