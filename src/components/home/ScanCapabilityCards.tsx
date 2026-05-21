"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.08 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 28, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 22, stiffness: 210 },
  },
};

const accents = [
  {
    ring: "from-cyan-400/75 via-violet-500/20 to-transparent",
    glow: "shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_48px_-12px_rgba(34,211,238,0.32)]",
    iconBox:
      "border-cyan-400/35 from-cyan-500/35 to-violet-950/50 shadow-[0_0_24px_rgba(34,211,238,0.15)]",
    icon: "text-cyan-300",
    bar: "from-cyan-400 via-cyan-300/50 to-transparent",
    hoverGlow: "group-hover:shadow-[0_0_56px_-6px_rgba(34,211,238,0.45)]",
  },
  {
    ring: "from-fuchsia-400/75 via-violet-500/20 to-transparent",
    glow: "shadow-[0_0_0_1px_rgba(232,121,249,0.18),0_0_48px_-12px_rgba(232,121,249,0.28)]",
    iconBox:
      "border-fuchsia-400/35 from-fuchsia-500/35 to-violet-950/50 shadow-[0_0_24px_rgba(232,121,249,0.12)]",
    icon: "text-fuchsia-300",
    bar: "from-fuchsia-400 via-fuchsia-300/50 to-transparent",
    hoverGlow: "group-hover:shadow-[0_0_56px_-6px_rgba(232,121,249,0.4)]",
  },
  {
    ring: "from-violet-400/75 via-indigo-500/20 to-transparent",
    glow: "shadow-[0_0_0_1px_rgba(167,139,250,0.18),0_0_48px_-12px_rgba(139,92,246,0.28)]",
    iconBox:
      "border-violet-400/35 from-violet-500/35 to-violet-950/50 shadow-[0_0_24px_rgba(139,92,246,0.12)]",
    icon: "text-violet-300",
    bar: "from-violet-400 via-violet-300/50 to-transparent",
    hoverGlow: "group-hover:shadow-[0_0_56px_-6px_rgba(139,92,246,0.38)]",
  },
  {
    ring: "from-amber-400/70 via-orange-500/15 to-transparent",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.15),0_0_48px_-12px_rgba(251,191,36,0.22)]",
    iconBox:
      "border-amber-400/30 from-amber-500/25 to-violet-950/50 shadow-[0_0_24px_rgba(251,191,36,0.1)]",
    icon: "text-amber-200",
    bar: "from-amber-400 via-amber-300/50 to-transparent",
    hoverGlow: "group-hover:shadow-[0_0_56px_-6px_rgba(251,191,36,0.32)]",
  },
] as const;

export type ScanCapabilityItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

interface ScanCapabilityCardsProps {
  items: ScanCapabilityItem[];
}

export function ScanCapabilityCards({ items }: ScanCapabilityCardsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-64px" }}
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const accent = accents[i % accents.length];

        return (
          <motion.article
            key={item.title}
            variants={itemUp}
            whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
            className={cn(
              "group relative rounded-2xl p-px transition-shadow duration-500",
              accent.glow,
              accent.hoverGlow
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-90",
                accent.ring
              )}
              aria-hidden
            />

            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12082a]/88 p-5 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent">
              <div
                className={cn(
                  "mb-4 h-0.5 w-10 rounded-full bg-gradient-to-r transition-all duration-500 ease-out group-hover:w-full",
                  accent.bar
                )}
                aria-hidden
              />

              <div className="relative mb-3 flex items-start justify-between gap-2">
                <motion.div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br",
                    accent.iconBox
                  )}
                  whileHover={{ rotate: [0, -6, 6, 0], scale: 1.06 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={cn("h-5 w-5", accent.icon)} strokeWidth={1.75} />
                </motion.div>
                <span className="pt-1 text-[10px] font-bold tabular-nums tracking-[0.22em] text-violet-400/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-2 text-sm font-bold tracking-tight text-white/95 transition-colors duration-300 group-hover:text-cyan-50">
                {item.title}
              </h3>
              <p className="flex-1 text-xs leading-relaxed text-violet-200/58 transition-colors duration-300 group-hover:text-violet-100/78">
                {item.desc}
              </p>

              <motion.div
                className="mt-4 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                aria-hidden
              />
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
