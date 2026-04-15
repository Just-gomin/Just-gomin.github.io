"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BLOG_TITLE } from "../constants";

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
    <nav style={{ height: 48 }} className="flex justify-between border-b">
      <div className="flex gap-8">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-(length:--font-size-subheading) font-bold"
          >
            {isActive(href) ? "[*]" + label.toUpperCase() : "[ ]" + label}
          </Link>
        ))}
      </div>

      <div className="flex items-baseline">
        <div className="text-(length:--font-size-subheading) font-bold">
          {BLOG_TITLE}
        </div>
      </div>
    </nav>
  );
}
