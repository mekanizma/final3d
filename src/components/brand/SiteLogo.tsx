"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sizeClass = {
  sm: "h-11 w-auto",
  md: "h-12 w-auto",
  nav: "h-[220px] w-auto",
  lg: "h-[4.5rem] w-auto",
  xl: "h-24 w-auto",
} as const;

const glowClass = {
  sm: "blur-xl scale-110",
  md: "blur-2xl scale-110",
  nav: "blur-2xl scale-110",
  lg: "blur-2xl scale-125",
  xl: "blur-3xl scale-125",
} as const;

type SiteLogoProps = {
  className?: string;
  size?: keyof typeof sizeClass;
  /** Nabız glow ve hafif yüzen animasyon */
  animated?: boolean;
};

export function SiteLogo({
  className,
  size = "sm",
  animated = false,
}: SiteLogoProps) {
  const glow = (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 rounded-2xl",
        "bg-gradient-to-br from-fuchsia-500/35 via-violet-500/25 to-cyan-400/20",
        glowClass[size]
      )}
      aria-hidden
    />
  );

  const imgClass = cn(
    sizeClass[size],
    "relative z-10 object-contain shrink-0",
    "drop-shadow-[0_0_14px_rgba(232,121,249,0.5)]"
  );

  if (!animated) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
      >
        {glow}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="FINAL3D"
          width={940}
          height={940}
          className={imgClass}
          decoding="async"
        />
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl",
          "bg-gradient-to-br from-fuchsia-500/40 via-violet-500/30 to-cyan-400/25",
          glowClass[size]
        )}
        aria-hidden
        animate={{
          opacity: [0.45, 0.9, 0.45],
          scale: [1.08, 1.28, 1.08],
          rotate: [0, 8, 0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full bg-fuchsia-400/20 blur-3xl"
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/logo.svg"
        alt="FINAL3D"
        width={940}
        height={940}
        className={imgClass}
        decoding="async"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.05,
          filter: "drop-shadow(0 0 24px rgba(232,121,249,0.85))",
        }}
      />
    </motion.span>
  );
}
