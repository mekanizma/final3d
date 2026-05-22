"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { HERO_PRINTER_VIDEO } from "@/lib/heroMedia";
import { ShippingPromo } from "@/components/shipping/ShippingPromo";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";

const HeroPrinterVideo = dynamic(
  () =>
    import("@/components/home/HeroPrinterVideo").then((m) => ({
      default: m.HeroPrinterVideo,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] sm:aspect-[16/11] max-h-[520px] bg-[#0a0618] bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_PRINTER_VIDEO.poster})` }}
        aria-hidden
      />
    ),
  }
);

export function HeroSection() {
  const { t } = useIntl();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100dvh-5.5rem)] flex items-center overflow-hidden grid-pattern"
    >
      <motion.div
        style={{ y, opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center py-20"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">
              <span className="block text-white/95">{t("hero.line1")}</span>
              <span className="text-neon block mt-2 sm:mt-3">{t("hero.line2")}</span>
            </h1>
            <div className="mb-4 max-w-xl rounded-2xl border border-fuchsia-400/25 bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 backdrop-blur-sm px-4 py-3 shadow-[0_0_45px_rgba(168,85,247,0.2)]">
              <p className="text-[17px] leading-relaxed font-medium text-violet-100/90">
                <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent font-semibold">
                  {t("hero.gradient")}
                </span>{" "}
                <span className="text-white/90">{t("hero.sub")}</span>{" "}
                {t("hero.end")}
              </p>
            </div>
            <ShippingPromo variant="inline" className="mb-8" />
            <div className="flex flex-wrap gap-4">
              <LocaleLink href="/urunler">
                <NeonButton size="lg">
                  {t("hero.ctaCatalog")}
                  <ArrowRight className="w-4 h-4" />
                </NeonButton>
              </LocaleLink>
              <LocaleLink href="/ozel-baski">
                <NeonButton variant="ghost" size="lg">
                  {t("hero.ctaCustom")}
                </NeonButton>
              </LocaleLink>
            </div>
          </motion.div>
        </div>

        <HeroPrinterVideo />
      </motion.div>
    </section>
  );
}
