"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Package,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { HomeServicesTeaser } from "@/components/home/HomeServicesTeaser";
import { ProductShowcaseRotator } from "@/components/home/ProductShowcaseRotator";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { categoryLabel } from "@/lib/order-labels";
import { PRODUCT_CATEGORIES } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const highlightCategories = PRODUCT_CATEGORIES;

export function HomeDiscoverSections() {
  const { t } = useIntl();

  const trustItems = [
    { icon: Truck, title: t("homeDiscover.trust1t"), desc: t("homeDiscover.trust1d") },
    {
      icon: ShieldCheck,
      title: t("homeDiscover.trust2t"),
      desc: t("homeDiscover.trust2d"),
    },
    {
      icon: CreditCard,
      title: t("homeDiscover.trust3t"),
      desc: t("homeDiscover.trust3d"),
    },
  ] as const;

  return (
    <div className="relative z-10">
      <HomeServicesTeaser />

      <section className="py-20 sm:py-24">
        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-glow text-xs mb-5">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              {t("homeDiscover.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("homeDiscover.title")}{" "}
              <span className="text-neon">{t("homeDiscover.titleNeon")}</span>
            </h2>
            <p className="text-violet-200/60 max-w-2xl mx-auto leading-relaxed">
              {t("homeDiscover.subtitle")}
            </p>
            <div className="section-glow max-w-md mx-auto mt-10" />
          </motion.div>

          <motion.article {...fadeUp} transition={{ duration: 0.55 }}>
            <GlassCard
              hover={false}
              className="overflow-hidden border-cyan-400/15 p-0"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-600/30 border border-white/10 flex items-center justify-center mb-6">
                    <Package className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                    {t("homeDiscover.cardTitle")}{" "}
                    <span className="text-neon">{t("homeDiscover.cardTitleNeon")}</span>
                  </h3>
                  <p className="text-violet-200/65 leading-relaxed mb-6 max-w-md">
                    {t("homeDiscover.cardBody")}
                  </p>
                  <ul className="flex flex-wrap gap-2 mb-8">
                    {highlightCategories.map((cat) => (
                      <li
                        key={cat}
                        className="px-3 py-1.5 rounded-full glass text-xs text-violet-100/85"
                      >
                        {categoryLabel(cat, t)}
                      </li>
                    ))}
                  </ul>
                  <LocaleLink href="/urunler" className="self-start">
                    <NeonButton size="lg">
                      {t("homeDiscover.ctaProducts")}
                      <ArrowRight className="w-4 h-4" />
                    </NeonButton>
                  </LocaleLink>
                </div>
                <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-full bg-gradient-to-br from-cyan-600/20 via-violet-900/40 to-fuchsia-900/30 border-t lg:border-t-0 lg:border-l border-white/5 overflow-hidden">
                  <div className="absolute inset-0 grid-pattern opacity-40" />
                  <motion.div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                    <ProductShowcaseRotator />
                  </motion.div>
                </div>
              </div>
            </GlassCard>
          </motion.article>
        </motion.div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="grid sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <GlassCard
                  key={item.title}
                  hover={false}
                  className="p-6 text-center sm:text-left border-white/5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/15 border border-white/10 flex items-center justify-center mx-auto sm:mx-0 mb-4">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <h4 className="font-semibold text-white/95 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-violet-200/55 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                </GlassCard>
              );
            })}
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-14 text-center"
          >
            <p className="text-violet-200/50 text-sm mb-4">
              {t("homeDiscover.bottomNote")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <LocaleLink href="/urunler">
                <NeonButton variant="ghost">{t("homeDiscover.products")}</NeonButton>
              </LocaleLink>
              <LocaleLink href="/order">
                <NeonButton>{t("homeDiscover.goOrder")}</NeonButton>
              </LocaleLink>
            </div>
          </motion.div>

          <div className="section-glow max-w-4xl mx-auto mt-16" />
        </div>
      </section>
    </div>
  );
}
