"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "./Check";

export const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/resume", label: "RESUME" },
  { href: "/notes", label: "NOTES" },
] as const;

/** 현재 경로가 링크가 가리키는 구역에 속하는지. 홈은 `/`일 때만입니다. */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <nav className="header-nav">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "is-active" : undefined}
              aria-current={active ? "page" : undefined}
            >
              <Check active={active}>{label}</Check>
            </Link>
          );
        })}
      </nav>

      <Link href="/" className="header-brand">
        Just-gomin<span className="dot">.</span>log
      </Link>
    </header>
  );
}
