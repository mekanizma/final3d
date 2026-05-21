"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

const GRID_STYLE = {
  "--grid--fill-mode": "var(--product-cards--fill-mode, auto-fill)",
  "--grid--row-gap": "var(--product-cards--gap, 0.65rem)",
  "--grid--column-gap": "var(--product-cards--column-gap, 0.25rem)",
  "--grid--column-max-count": "var(--product-cards--column-max-count, 4)",
  "--grid--column-min-width": "var(--product-cards--column-min-width, 12.5rem)",
} as CSSProperties;

interface ProductCardsGridProps {
  children: ReactNode;
  className?: string;
  /** Katalog: sidebar varken 3, yoksa 4 sütun */
  columnMaxCount?: 3 | 4 | 5;
}

export function ProductCardsGrid({
  children,
  className,
  columnMaxCount = 3,
}: ProductCardsGridProps) {
  return (
    <div
      className={cn("scope product-cards", className)}
      style={
        {
          "--product-cards--column-max-count": columnMaxCount,
        } as CSSProperties
      }
    >
      <div className="_card-list grid" style={GRID_STYLE}>
        {children}
      </div>
      <svg
        width={0}
        height={0}
        style={{ visibility: "hidden", position: "fixed" }}
        aria-hidden
      >
        <filter id="svg-inset-shadow">
          <feOffset in="SourceAlpha" dx="6" dy="8" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
          <feComposite in="SourceAlpha" operator="out" />
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
      </svg>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="_card-skeleton" />
  );
}
