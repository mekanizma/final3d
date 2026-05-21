"use client";

import { motion } from "framer-motion";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitClauses(text: string): string[] {
  return text
    .split(/(?<=[.;])\s+|(?<=—)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function renderWithHighlights(text: string, highlights: string[]) {
  if (!highlights.length) return text;

  const terms = [...highlights]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${terms.map(escapeRegex).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const hit = terms.some(
      (term) => part.localeCompare(term, undefined, { sensitivity: "accent" }) === 0
    );
    if (hit) {
      return (
        <span key={`${part}-${i}`} className="prose-highlight">
          {part}
        </span>
      );
    }
    return <span key={`${part}-${i}`}>{part}</span>;
  });
}

interface AnimatedProseProps {
  lead: string;
  sub?: string;
  /** Pipe-separated: scanSection.highlights */
  highlights?: string;
  baseDelay?: number;
}

export function AnimatedProse({
  lead,
  sub,
  highlights = "",
  baseDelay = 0.2,
}: AnimatedProseProps) {
  const terms = highlights
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const clauses = splitClauses(lead);

  return (
    <div className="mb-8 max-w-lg">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-violet-500/8 to-fuchsia-500/10 px-4 py-4 sm:px-5 sm:py-5 shadow-[0_0_48px_rgba(34,211,238,0.1)] backdrop-blur-sm">
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-70"
          aria-hidden
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, rgba(34,211,238,0.14) 50%, rgba(232,121,249,0.1) 55%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative space-y-2.5 sm:space-y-3">
          {clauses.map((clause, i) => (
            <motion.p
              key={clause.slice(0, 24)}
              className="text-base sm:text-lg leading-relaxed text-violet-100/92"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{
                duration: 0.6,
                delay: baseDelay + i * 0.13,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {renderWithHighlights(clause, terms)}
            </motion.p>
          ))}
        </div>
      </div>

      {sub ? (
        <motion.p
          className="mt-4 text-sm leading-relaxed text-violet-300/65 sm:text-[15px]"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.55,
            delay: baseDelay + clauses.length * 0.13 + 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {renderWithHighlights(sub, terms.slice(0, 3))}
        </motion.p>
      ) : null}
    </div>
  );
}
