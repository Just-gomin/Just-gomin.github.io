"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AsciiDivider } from "./AsciiDivider";
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
  // 서랍을 연 경로. 경로가 바뀌면 열린 상태가 저절로 풀립니다.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const close = () => setOpenedAt(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = NAV_LINKS.map((link) => ({
    ...link,
    active: isActivePath(pathname, link.href),
  }));

  return (
    <header className="header">
      <nav className="header-nav">
        {links.map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            className={active ? "is-active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            <Check active={active}>{label}</Check>
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="header-hamburger"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpenedAt(open ? null : pathname)}
      >
        <span aria-hidden="true">{open ? "[x]" : "[≡]"}</span>
      </button>

      <Link href="/" className="header-brand">
        Just-gomin<span className="dot">.</span>log
      </Link>

      {open && (
        <>
          <div className="drawer-backdrop" onClick={close} />
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="메뉴"
          >
            <div className="drawer-head">
              <span className="drawer-title">{"// menu"}</span>
              <button
                type="button"
                className="drawer-close"
                aria-label="닫기"
                onClick={close}
              >
                [x] close
              </button>
            </div>
            <AsciiDivider />
            <nav className="drawer-nav">
              {links.map(({ href, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                >
                  <Check active={active}>{label}</Check>
                </Link>
              ))}
            </nav>
            <AsciiDivider />
            <div className="drawer-foot">
              <a
                href="https://github.com/Just-gomin"
                target="_blank"
                rel="noreferrer"
              >
                github ↗
              </a>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
