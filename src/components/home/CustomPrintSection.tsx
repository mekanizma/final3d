"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  Palette,
  Truck,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  CircleDot,
  CheckCircle2,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { PRINT_MATERIALS } from "@/lib/printMaterials";
import { useIntl } from "@/components/i18n/IntlProvider";
import { LocaleLink } from "@/components/i18n/LocaleLink";

const materialIcons = {
  pla: Sparkles,
  abs: Shield,
  petg: Layers,
  tpu: CircleDot,
} as const;

const stepIcons = [Upload, Palette, Truck] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

interface CustomPrintSectionProps {
  onPage?: boolean;
}

export function CustomPrintSection({ onPage = false }: CustomPrintSectionProps) {
  const { t } = useIntl();
  const steps = [
    {
      icon: stepIcons[0],
      title: t("customPrintSection.step1Title"),
      desc: t("customPrintSection.step1Desc"),
    },
    {
      icon: stepIcons[1],
      title: t("customPrintSection.step2Title"),
      desc: t("customPrintSection.step2Desc"),
    },
    {
      icon: stepIcons[2],
      title: t("customPrintSection.step3Title"),
      desc: t("customPrintSection.step3Desc"),
    },
  ] as const;

  return (
    <section
      className={`relative z-10 overflow-hidden ${
        onPage ? "pt-20 pb-12 sm:pt-24 sm:pb-16" : "py-24 sm:py-28"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,90vw)] h-[400px] bg-gradient-to-r from-fuchsia-600/20 via-violet-600/15 to-cyan-500/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-glow text-xs mb-6">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              {t("customPrintSection.badge")}
            </span>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-6">
              <span className="block text-white/95">{t("customPrintSection.h1a")}</span>
              <span className="block text-white/95 mt-1">{t("customPrintSection.h1b")}</span>
              <span className="text-neon block mt-2 sm:mt-3">{t("customPrintSection.h1c")}</span>
            </h2>

            <p className="text-violet-200/75 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              {t("customPrintSection.lead")}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {PRINT_MATERIALS.map((mat) => {
                const Icon = materialIcons[mat.id];
                return (
                  <span
                    key={mat.id}
                    title={t(`printMaterial.${mat.id}.hint`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium text-violet-100/90"
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${mat.color}`}
                      strokeWidth={2}
                    />
                    {t(`printMaterial.${mat.id}.label`)}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {onPage ? (
                <a href="#talep-form">
                  <NeonButton size="lg">
                    {t("customPrintSection.ctaForm")}
                    <ArrowRight className="w-4 h-4" />
                  </NeonButton>
                </a>
              ) : (
                <LocaleLink href="/ozel-baski">
                  <NeonButton size="lg">
                    {t("customPrintSection.ctaSendFile")}
                    <ArrowRight className="w-4 h-4" />
                  </NeonButton>
                </LocaleLink>
              )}
              <LocaleLink href="/urunler">
                <NeonButton variant="ghost" size="lg">
                  {t("customPrintSection.ctaProducts")}
                </NeonButton>
              </LocaleLink>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }}>
            <GlassCard
              hover={false}
              className="p-6 sm:p-8 border-fuchsia-400/20 relative overflow-hidden"
            >
              <motion.div className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full bg-fuchsia-500/20 blur-2xl" />
              <div className="pointer-events-none absolute -left-6 bottom-0 w-28 h-28 rounded-full bg-cyan-400/15 blur-2xl" />

              <p className="text-sm font-semibold text-violet-200/80 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {t("customPrintSection.howItWorks")}
              </p>

              <div className="space-y-5">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      className="flex gap-4 items-start"
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                    >
                      <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-500/80 text-[10px] font-bold flex items-center justify-center text-white">
                          {i + 1}
                        </span>
                        <Icon className="w-5 h-5 text-cyan-300" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white/95">{step.title}</h3>
                        <p className="text-sm text-violet-200/55 mt-0.5">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-violet-300/50 leading-relaxed">
                  {t("customPrintSection.footerNote")}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <div className="section-glow max-w-4xl mx-auto mt-20 px-6" />
    </section>
  );
}
