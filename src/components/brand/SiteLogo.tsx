"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_LOGO_PATH } from "@/lib/seo/constants";

const sizeClass = {
  sm: "h-11 w-auto",
  md: "h-12 w-auto",
  /** Navbar — dikey kompozisyonlu PNG, header yüksekliğine oturur */
  nav: "block h-[5rem] w-auto max-w-[min(52vw,11.5rem)] sm:max-w-[13rem]",
  lg: "h-20 w-auto",
  xl: "h-28 w-auto",
} as const;

const glowClass = {
  sm: "blur-xl scale-110",
  md: "blur-2xl scale-110",
  nav: "blur-lg scale-105 opacity-70",
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
        "bg-gradient-to-br from-fuchsia-500/25 via-violet-500/15 to-cyan-400/10",
        glowClass[size]
      )}
      aria-hidden
    />
  );

  const imgClass = cn(
    sizeClass[size],
    "relative z-10 object-contain shrink-0",
    "drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)]"
  );

  if (!animated && size === "nav") {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={SITE_LOGO_PATH}
        alt="FINAL3D"
        className={cn(imgClass, className)}
        style={{ height: "5rem", width: "auto" }}
        decoding="async"
        fetchPriority="high"
      />
    );
  }

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
          src={SITE_LOGO_PATH}
          alt="FINAL3D"
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
          "bg-gradient-to-br from-fuchsia-500/30 via-violet-500/20 to-cyan-400/15",
          glowClass[size]
        )}
        aria-hidden
        animate={{
          opacity: [0.35, 0.75, 0.35],
          scale: [1.08, 1.22, 1.08],
          rotate: [0, 6, 0, -6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={SITE_LOGO_PATH}
        alt="FINAL3D"
        className={imgClass}
        decoding="async"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.04,
          filter: "drop-shadow(0 6px 24px rgba(56,189,248,0.45))",
        }}
      />
    </motion.span>
  );
}
