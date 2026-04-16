type Props = {
  tags: string[];
};

export function TagFilter({ tags }: Props) {
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
        <button className="text-(length:--font-size-body) font-bold">
          CLEAR
        </button>
      </div>
      <div>
        {tags.map((tag: string) => (
          <button key={tag}>[ ] {tag}</button>
        ))}
      </div>
    </div>
  );
}
