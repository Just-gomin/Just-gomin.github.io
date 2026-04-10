"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "/HOME" },
  { href: "/resume", label: "/RESUME" },
  { href: "/notes", label: "/NOTES" },
] as const;

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    return href === "/"
      ? pathname.trim() === "/"
      : pathname.trim().startsWith(href);
  };

  return (
    <nav
      style={{ padding: "var(--padding-base)" }}
      className="flex justify-between items-center"
    >
      <div className="flex gap-8">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              (isActive(href)
                ? "text-(length:--font-size-heading) font-bold"
                : "text-(length:--font-size-body)") + "algin-baseline"
            }
          >
            {isActive(href) ? label.toUpperCase() : label}
          </Link>
        ))}
      </div>
      <span className="text-(length:--font-size-body)">
        just0gomin@gmail.com
      </span>
    </nav>
  );
}
