"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ScanLine,
  ArrowRight,
  Box,
  Palette,
  FileBox,
  Zap,
  Ruler,
  Sun,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { Scan3DVideo } from "@/components/home/Scan3DVideo";
import { SCAN_IMAGES } from "@/lib/scanMedia";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const capabilities = [
  {
    icon: Ruler,
    title: "Hassas geometri",
    desc: "Küçük parçalardan orta ölçekli objelere kadar detaylı mesh.",
  },
  {
    icon: Palette,
    title: "Renkli doku",
    desc: "RGB ile gerçekçi yüzey; sunum ve arşiv için hazır model.",
  },
  {
    icon: Sun,
    title: "Zorlu yüzeyler",
    desc: "Koyu veya parlak parçalarda pratik tarama süreçleri.",
  },
  {
    icon: FileBox,
    title: "Standart formatlar",
    desc: "STL, OBJ, PLY ve 3MF — CAD ve slicer ile uyumlu.",
  },
] as const;

const workflow = [
  {
    step: "01",
    title: "Tarama",
    desc: "Nesnenizi stüdyoda veya sahada el tipi tarayıcı ile dijitalleştiriyoruz.",
  },
  {
    step: "02",
    title: "Model hazırlığı",
    desc: "Mesh temizliği, hizalama ve baskıya veya tasarıma uygun dosya.",
  },
  {
    step: "03",
    title: "Baskı",
    desc: "Dijital modelden PLA, ABS, PETG veya TPU ile üretim — tek süreç.",
  },
] as const;

export function Scan3DSection() {
  return (
    <section className="relative pt-24 sm:pt-28 pb-24 sm:pb-28 z-10 overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 right-0 w-[min(700px,80vw)] h-[350px] bg-gradient-to-l from-cyan-600/20 via-violet-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-fuchsia-600/15 blur-3xl rounded-full" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-glow text-xs mb-6">
              <ScanLine className="w-3 h-3 text-cyan-300" />
              Hizmetimiz · 3D Tarama
            </span>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-6">
              <span className="block text-white/95">NESNELERİ TARAYIP</span>
              <span className="text-neon block mt-2 sm:mt-3">
                YENİDEN HAYAT VERİYORUZ.
              </span>
            </h2>

            <p className="text-violet-200/75 text-base sm:text-lg leading-relaxed max-w-lg mb-4">
              Nesneleri{" "}
              <strong className="text-white/90">dijitalize ediyoruz</strong>,
              baskısını üretiyoruz. Gerçek dünyadaki parçanızı veya objenizi{" "}
              <strong className="text-white/90">profesyonel 3D tarama</strong> ile
              ölçüyoruz; temiz dijital modeli hazırlıyor, isteğinize göre{" "}
              <strong className="text-white/90">filament baskısını</strong> aynı
              çatı altında tamamlıyoruz. Tarama, dosya ve üretim — tek adres.
            </p>
            <p className="text-sm text-violet-300/50 max-w-lg mb-8 leading-relaxed">
              Tersine mühendislik, arşiv, prototip veya kopya parça: el tipi
              tarayıcı, renkli doku ve KKTC&apos;de stüdyo / saha hizmeti.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/3d-tarama/teklif">
                <NeonButton size="lg">
                  Tarama Teklifi Al
                  <ArrowRight className="w-4 h-4" />
                </NeonButton>
              </Link>
              <a href="#detay">
                <NeonButton variant="ghost" size="lg">
                  Özellikleri İncele
                </NeonButton>
              </a>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/4] max-h-[520px] rounded-2xl overflow-hidden border border-cyan-400/20 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
              <Scan3DVideo />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12082a]/90 via-[#12082a]/25 to-transparent pointer-events-none z-[1]" />
              <div className="absolute inset-0 card-vignette pointer-events-none z-[1]" />

              <div className="absolute bottom-4 left-4 right-4 flex gap-3 z-[2]">
                <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-lg">
                  <ProductPhoto
                    src={SCAN_IMAGES.model}
                    alt="Tablet üzerinde incelenen 3D tarama modeli"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-lg">
                  <ProductPhoto
                    src={SCAN_IMAGES.workflow}
                    alt="El tipi 3D tarayıcı ile ölçüm"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute top-4 left-4 z-[2] glass px-3 py-2 rounded-xl border border-cyan-400/30 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-medium text-cyan-100/90">
                  Canlı tarama hizmeti
                </span>
              </div>
            </div>

            <motion.div
              className="absolute -z-10 -right-6 -bottom-6 w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl"
              aria-hidden
            />
          </motion.div>
        </div>

        <motion.div id="detay" className="scroll-mt-28">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {capabilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <GlassCard
                  key={item.title}
                  hover={false}
                  className="p-5 border-white/5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/25 to-violet-500/20 border border-white/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <h3 className="font-semibold text-white/95 text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-violet-200/55 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                </GlassCard>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <GlassCard
              hover={false}
              className="p-6 sm:p-8 border-fuchsia-400/15"
            >
              <p className="text-sm font-semibold text-violet-200/80 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Tarama → model → baskı (tek adres)
              </p>
              <div className="space-y-5">
                {workflow.map((w, i) => (
                  <motion.div
                    key={w.step}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <span className="text-lg font-bold text-fuchsia-400/80 tabular-nums shrink-0">
                      {w.step}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white/95">{w.title}</h4>
                      <p className="text-sm text-violet-200/55 mt-0.5">{w.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard
              hover={false}
              className="p-6 sm:p-8 border-cyan-400/15 flex flex-col"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-300" />
                Kimler için?
              </h3>
              <ul className="space-y-3 text-sm text-violet-200/65 flex-1">
                {[
                  "Tersine mühendislik ve yedek parça üretimi",
                  "Prototip, ürün tasarımı ve kalite kontrol",
                  "Sanat, mimari ve kültürel miras dijitalleştirme",
                  "Eğitim, atölye ve maker projeleri",
                  "Mevcut parçadan 3D baskıya geçiş",
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <Zap className="w-4 h-4 text-fuchsia-400/70 shrink-0 mt-0.5" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-violet-300/45 mt-6 pt-4 border-t border-white/10 leading-relaxed">
                Profesyonel el tipi tarayıcı altyapısı; detay modu ve geniş alan
                taraması ile esnek çözüm. Çıktılarınızı slicer veya CAD
                yazılımınızda doğrudan kullanın.
              </p>
              <Link href="/3d-tarama/teklif" className="mt-6 self-start">
                <NeonButton>
                  <Box className="w-4 h-4" />
                  Teklif Formu
                </NeonButton>
              </Link>
            </GlassCard>
          </div>
        </motion.div>
      </div>

      <div className="section-glow max-w-4xl mx-auto mt-20 px-6" />
    </section>
  );
}
