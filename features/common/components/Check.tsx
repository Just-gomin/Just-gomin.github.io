import type { ReactNode } from "react";

type CheckProps = {
  active: boolean;
  children: ReactNode;
};

/** `[x]HOME`처럼 체크박스 모양을 붙인 라벨. 선택된 항목은 `x`를 강조 색으로 보여 줍니다. */
export function Check({ active, children }: CheckProps) {
  return (
    <span>
      <span className="text-fg-muted">[</span>
      <span className={active ? "text-accent" : "text-fg-muted"}>
        {active ? "x" : " "}
      </span>
      <span className="text-fg-muted">]</span>
      {children}
    </span>
  );
}
