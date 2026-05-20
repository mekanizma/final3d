"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function NeonButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled,
  size = "md",
}: NeonButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary: "btn-neon text-white font-semibold rounded-xl",
    ghost:
      "bg-white/5 border border-fuchsia-400/30 text-fuchsia-100 hover:border-cyan-400/50 hover:bg-white/10 hover:text-white rounded-xl backdrop-blur-sm",
    danger:
      "bg-rose-500/15 border border-rose-400/40 text-rose-300 hover:bg-rose-500/25 rounded-xl",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        sizes[size],
        variants[variant],
        "inline-flex items-center justify-center gap-2 transition-all",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
