import { BLOG_TITLE } from "../constants";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header
      style={{ padding: "var(--padding-base)" }}
      className="flex justify-between border"
    >
      <Nav />
      <div className="flex items-baseline">
        <div className="text-(length:--font-size-subheading) font-bold">
          {BLOG_TITLE}
        </div>
      </div>
    </header>
  );
}
