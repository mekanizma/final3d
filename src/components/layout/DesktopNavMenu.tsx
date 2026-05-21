"use client";

import { usePathname } from "next/navigation";
import { stripLocalePath } from "@/lib/locale-path";
import { NavMenuCard, type NavLinkConfig } from "@/components/layout/NavMenuCard";

export function DesktopNavMenu({ links }: { links: NavLinkConfig[] }) {
  const pathname = usePathname() || "/";
  const innerPath = stripLocalePath(pathname);

  return (
    <nav
      className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0"
      aria-label="Ana menü"
    >
      {links.map((link) => {
        const active =
          link.href === "/"
            ? innerPath === "/"
            : innerPath.startsWith(link.href);
        return (
          <NavMenuCard
            key={link.href}
            {...link}
            active={active}
            variant="desktop"
          />
        );
      })}
    </nav>
  );
}
