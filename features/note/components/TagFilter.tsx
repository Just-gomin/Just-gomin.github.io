type Props = {
  tags: string[];
};

export function TagFilter({ tags }: Props) {
  return (
    <div
      className="flex flex-col"
      style={{ width: "180px", gap: "var(--margin-base)" }}
    >
      <div className="flex flex-row justify-between border-b">
        <p className="text-(length:--font-size-body) font-bold">FILTER</p>
        <button className="text-(length:--font-size-small) font-bold">
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
