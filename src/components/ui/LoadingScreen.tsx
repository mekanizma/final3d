"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(165deg, #1a0b3e 0%, #12082a 50%, #0c1638 100%)",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative w-20 h-20"
        style={{ perspective: "600px" }}
      >
        <motion.div
          className="absolute inset-0 border-2 border-fuchsia-400/70 rounded-lg"
          animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-violet-400/70 rounded-lg"
          animate={{ rotateX: [360, 0], rotateY: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          className="absolute inset-4 border-2 border-cyan-400/80 rounded-lg"
          animate={{ rotateX: [0, 360], rotateY: [360, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
      </motion.div>
      <motion.p
        className="mt-8 text-sm tracking-[0.3em] uppercase text-neon font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Final3d
      </motion.p>
    </motion.div>
  );
}

