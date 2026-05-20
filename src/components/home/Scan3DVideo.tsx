"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { SCAN_VIDEO } from "@/lib/scanMedia";
import { cn } from "@/lib/utils";

interface Scan3DVideoProps {
  className?: string;
}

export function Scan3DVideo({ className }: Scan3DVideoProps) {
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

    void play();

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
    <div className={cn("absolute inset-0 bg-[#0a0618]", className)}>
      {!ready && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SCAN_VIDEO.poster})` }}
          aria-hidden
        ></div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover saturate-[1.1] contrast-[1.05]"
        src={SCAN_VIDEO.src}
        poster={SCAN_VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onLoadedData={() => setReady(true)}
        aria-label="3D tarama tanıtım videosu"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-transparent to-violet-600/15 mix-blend-screen" />

      {!ready && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/25">
          <Play className="w-10 h-10 text-white/70" strokeWidth={1.5} aria-hidden />
        </div>
      )}
    </div>
  );
}
