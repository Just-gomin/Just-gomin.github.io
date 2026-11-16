type Props = {
  tags: string[];
  selectedTags: string[];
  // 없으면 버튼을 비활성화한다. 서버에서 미리 렌더링하는 Suspense fallback용이다.
  onToggle?: (tag: string) => void;
  onClear?: () => void;
};

export function TagFilter({ tags, selectedTags, onToggle, onClear }: Props) {
  return (
    <div
      className="flex flex-col"
      style={{ width: "180px", gap: "var(--margin-base)" }}
    >
      <div
        className="flex flex-row items-baseline-last justify-between border-b"
        style={{ paddingBottom: "8px", height: "44px" }}
      >
        <p className="text-(length:--font-size-subheading) font-bold">FILTER</p>
        <button
          className="text-(length:--font-size-body) font-bold"
          disabled={!onClear}
          onClick={onClear}
        >
          CLEAR
        </button>
      </div>
      <div>
        {tags.map((tag: string) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              aria-pressed={isSelected}
              disabled={!onToggle}
              onClick={onToggle && (() => onToggle(tag))}
            >
              {isSelected ? "[*]" : "[ ]"} {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
