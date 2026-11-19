import type { ReactNode } from "react";
import { Cursor } from "./Cursor";

type PageTitleProps = {
  /** 제목 앞에 옅게 붙는 말. 예: `// notes` */
  prefix?: string;
  /** 제목 끝에 강조 색 커서를 둡니다. */
  cursor?: boolean;
  children: ReactNode;
};

export function PageTitle({
  prefix,
  cursor = false,
  children,
}: PageTitleProps) {
  return (
    <h1 className="page-title">
      {prefix && <span className="prefix">{prefix}</span>}
      <span>{children}</span>
      {cursor && <Cursor accent />}
    </h1>
  );
}
