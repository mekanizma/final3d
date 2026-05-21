"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { cn } from "@/lib/utils";

export type NavLinkConfig = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 6 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type NavMenuCardProps = NavLinkConfig & {
  active: boolean;
  variant: "mobile" | "desktop";
  onNavigate?: () => void;
  motionVariant?: boolean;
};

export function NavMenuCard({
  href,
  label,
  icon: Icon,
  active,
  variant,
  onNavigate,
  motionVariant = false,
}: NavMenuCardProps) {
  if (variant === "desktop") {
    const link = (
      <LocaleLink href={href} onClick={onNavigate} className="group relative">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            active
              ? "text-white bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "text-violet-200/70 hover:text-violet-50 hover:bg-white/[0.05]"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              active ? "text-cyan-300/90" : "text-violet-400/70 group-hover:text-violet-200"
            )}
            strokeWidth={active ? 2.25 : 2}
          />
          <span className="whitespace-nowrap tracking-tight">{label}</span>
        </span>
        {active && (
          <span
            className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
            aria-hidden
          />
        )}
      </LocaleLink>
    );
    return link;
  }

  const row = (
    <LocaleLink
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 transition-colors duration-200",
        active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
          active
            ? "border-cyan-400/25 bg-cyan-500/10 text-cyan-200"
            : "border-white/8 bg-white/[0.03] text-violet-300/90"
        )}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
      </span>
      <span
        className={cn(
          "flex-1 text-[15px] font-medium tracking-tight",
          active ? "text-white" : "text-violet-100/90"
        )}
      >
        {label}
      </span>
      <ChevronRight
        className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          active ? "text-cyan-400/60" : "text-violet-500/50"
        )}
        strokeWidth={2}
      />
    </LocaleLink>
  );

  if (motionVariant) {
    return <motion.div variants={itemVariants}>{row}</motion.div>;
  }

  return row;
}

export { itemVariants as navMenuItemVariants };
