"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
    out.push(sorted[i]);
  }
  return out;
}

export interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: {
    prev: string;
    next: string;
    page: string;
    pageOfFormatted: string;
  };
  className?: string;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
  labels,
  className,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = pageNumbers(currentPage, totalPages);

  return (
    <nav
      className={cn("flex flex-col sm:flex-row items-center justify-center gap-4 mt-10", className)}
      aria-label={labels.page}
    >
      <p className="text-sm text-violet-200/55 order-2 sm:order-1 sm:mr-auto">
        {labels.pageOfFormatted}
      </p>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all",
            currentPage <= 1
              ? "opacity-40 cursor-not-allowed border-white/5 text-violet-300/40"
              : "glass border-white/10 text-violet-100 hover:border-cyan-400/30 hover:text-white"
          )}
          aria-label={labels.prev}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{labels.prev}</span>
        </button>

        <div className="flex items-center gap-1 px-1">
          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <span
                key={`e-${i}`}
                className="w-9 text-center text-violet-400/50 text-sm select-none"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "min-w-[2.25rem] h-9 px-2 rounded-xl text-sm font-medium border transition-all",
                  p === currentPage
                    ? "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white border-transparent shadow-lg shadow-fuchsia-500/25"
                    : "glass border-white/10 text-violet-200/70 hover:border-cyan-400/30 hover:text-white"
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all",
            currentPage >= totalPages
              ? "opacity-40 cursor-not-allowed border-white/5 text-violet-300/40"
              : "glass border-white/10 text-violet-100 hover:border-cyan-400/30 hover:text-white"
          )}
          aria-label={labels.next}
        >
          <span className="hidden sm:inline">{labels.next}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
