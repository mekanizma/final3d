"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { HERO_PRINTER_VIDEO } from "@/lib/heroMedia";
import { useIntl } from "@/components/i18n/IntlProvider";

export function HeroPrinterVideo() {
  const { t } = useIntl();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.volume = 0;
    video.defaultMuted = true;

    const enforceSilent = () => {
      video.muted = true;
      video.volume = 0;
    };
    video.addEventListener("volumechange", enforceSilent);

    const play = async () => {
      try {
        enforceSilent();
        await video.play();
        setReady(true);
      } catch {
        setReady(false);
      }
    };

    play();

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else void play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("volumechange", enforceSilent);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-fuchsia-500/50 via-violet-500/35 to-cyan-400/50 rounded-[2rem] blur-3xl"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.35)] bg-black/40">
        <span className="pointer-events-none absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/70 rounded-tl-lg z-10" />
        <span className="pointer-events-none absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/70 rounded-tr-lg z-10" />
        <span className="pointer-events-none absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-fuchsia-400/70 rounded-bl-lg z-10" />
        <span className="pointer-events-none absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-fuchsia-400/70 rounded-br-lg z-10" />

        <motion.div
          className="relative aspect-[4/5] sm:aspect-[16/11] max-h-[520px] w-full bg-[#0a0618]"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {!ready && (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO_PRINTER_VIDEO.poster})` }}
            />
          )}

          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover saturate-[1.15] contrast-[1.05]"
            src={HERO_PRINTER_VIDEO.src}
            poster={HERO_PRINTER_VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onLoadedData={() => setReady(true)}
            aria-label={t("hero.videoAria")}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12082a]/95 via-[#12082a]/20 to-[#1a0a3a]/40" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-600/25 via-transparent to-cyan-500/20 mix-blend-screen" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.12)_3px)]" />

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5 bg-gradient-to-t from-black/85 to-transparent">
            <p className="text-sm sm:text-base font-semibold text-white">
              {t("hero.videoCaption")}
            </p>
            <p className="text-xs text-violet-200/75 mt-0.5">
              {t("hero.videoSubline")}
            </p>
          </div>

          {!ready && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
              <Play className="w-12 h-12 text-white/80" strokeWidth={1.5} />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
