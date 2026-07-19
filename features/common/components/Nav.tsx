"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/resume", label: "RESUME" },
  { href: "/notes", label: "NOTES" },
] as const;

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    return href === "/"
      ? pathname.trim() === "/"
      : pathname.trim().startsWith(href);
  };

  return (
    <nav className="flex gap-8">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-(length:--font-size-subheading) font-bold"
        >
          {isActive(href) ? "[*]" + label.toUpperCase() : "[ ]" + label}
        </Link>
      ))}
    </nav>
  );
}
