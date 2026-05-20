"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, Upload, Zap } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";
import { useIntl } from "@/components/i18n/IntlProvider";
import { LocaleLink } from "@/components/i18n/LocaleLink";

const HomeServicesCanvas = dynamic(
  () =>
    import("@/components/home/HomeServicesCanvas").then((m) => ({
      default: m.HomeServicesCanvas,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 h-[min(420px,55vh)] bg-gradient-to-b from-violet-950/30 via-transparent to-[#12082a]/80 animate-pulse"
        aria-hidden
      />
    ),
  }
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 26, stiffness: 200 },
  },
};

export function HomeServicesTeaser() {
  const { t } = useIntl();

  const services = [
    {
      href: "/3d-tarama",
      ctaHref: "/3d-tarama/teklif",
      ctaLabel: t("homeServices.scanCta"),
      icon: ScanLine,
      accent: "cyan" as const,
      title: t("homeServices.scanTitle"),
      tagline: t("homeServices.scanTag"),
      desc: t("homeServices.scanDesc"),
      bullets: [
        t("homeServices.scanBullet0"),
        t("homeServices.scanBullet1"),
        t("homeServices.scanBullet2"),
      ],
    },
    {
      href: "/ozel-baski",
      ctaHref: "/ozel-baski#talep-form",
      ctaLabel: t("homeServices.printCta"),
      icon: Upload,
      accent: "fuchsia" as const,
      title: t("homeServices.printTitle"),
      tagline: t("homeServices.printTag"),
      desc: t("homeServices.printDesc"),
      bullets: [
        t("homeServices.printBullet0"),
        t("homeServices.printBullet1"),
        t("homeServices.printBullet2"),
      ],
    },
  ] as const;

  return (
    <section className="relative z-10 overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,211,238,0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(232,121,249,0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.06)_4px)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(420px,55vh)] sm:h-[min(480px,50vh)]">
        <HomeServicesCanvas />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(420px,55vh)] sm:h-[min(480px,50vh)] bg-gradient-to-b from-[#12082a]/20 via-[#12082a]/75 to-[#12082a]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200/90 backdrop-blur-md"
          >
            <Zap className="h-3.5 w-3.5 text-amber-300" aria-hidden />
            {t("homeServices.badge")}
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              {t("homeServices.h2a")}
            </span>{" "}
            <span className="bg-gradient-to-r from-fuchsia-300 via-neon to-cyan-300 bg-clip-text text-transparent">
              {t("homeServices.h2b")}
            </span>{" "}
            <span className="text-white/90">{t("homeServices.h2c")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-violet-200/65 sm:text-base">
            {t("homeServices.sub")}
          </p>
        </motion.header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-5 sm:gap-6 md:grid-cols-2"
        >
          {services.map((svc) => {
            const Icon = svc.icon;
            const ring =
              svc.accent === "cyan"
                ? "from-cyan-400/70 via-violet-500/30 to-transparent"
                : "from-fuchsia-400/70 via-violet-500/30 to-transparent";
            const glow =
              svc.accent === "cyan"
                ? "shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_0_60px_-12px_rgba(34,211,238,0.35)]"
                : "shadow-[0_0_0_1px_rgba(232,121,249,0.15),0_0_60px_-12px_rgba(232,121,249,0.35)]";

            return (
              <motion.article
                key={svc.title}
                variants={itemUp}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={cn(
                  "group relative rounded-2xl p-[1px] transition-shadow duration-500 hover:shadow-[0_0_80px_-8px_rgba(168,85,247,0.25)]",
                  glow
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-90 blur-xl transition-opacity duration-500 group-hover:opacity-100",
                    ring
                  )}
                  aria-hidden
                />
                <div
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12082a]/85 p-6 backdrop-blur-xl sm:p-8",
                    "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.04] before:to-transparent"
                  )}
                >
                  <div className="relative mb-5 flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: [0, -6, 6, 0], scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-lg",
                        svc.accent === "cyan"
                          ? "border-cyan-400/35 from-cyan-500/35 to-violet-900/50"
                          : "border-fuchsia-400/35 from-fuchsia-500/35 to-violet-900/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-7 w-7",
                          svc.accent === "cyan"
                            ? "text-cyan-300"
                            : "text-fuchsia-300"
                        )}
                        strokeWidth={1.75}
                      />
                    </motion.div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {svc.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-violet-300/60">
                        {svc.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="relative mb-5 flex-1 text-sm leading-relaxed text-violet-200/70">
                    {svc.desc}
                  </p>

                  <ul className="relative mb-6 flex flex-wrap gap-2">
                    {svc.bullets.map((b) => (
                      <li
                        key={b}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-violet-100/85 backdrop-blur-sm transition-colors group-hover:border-white/15"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto flex flex-wrap gap-3">
                    <LocaleLink href={svc.href} className="min-w-0">
                      <NeonButton variant="ghost" size="sm">
                        {t("homeServices.explore")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </NeonButton>
                    </LocaleLink>
                    <LocaleLink href={svc.ctaHref}>
                      <NeonButton size="sm">{svc.ctaLabel}</NeonButton>
                    </LocaleLink>
                  </div>

                  <div
                    className={cn(
                      "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50",
                      svc.accent === "cyan" ? "bg-cyan-500" : "bg-fuchsia-500"
                    )}
                    aria-hidden
                  />
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="section-glow mx-auto mt-16 max-w-lg sm:mt-20"
        />
      </div>
    </section>
  );
}
