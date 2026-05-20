"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductPhoto } from "@/components/ui/ProductPhoto";

interface FlyingCartAnimationProps {
  trigger: boolean;
  imageUrl: string;
}

export function FlyingCartAnimation({
  trigger,
  imageUrl,
}: FlyingCartAnimationProps) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed z-[200] w-12 h-12 rounded-lg overflow-hidden shadow-2xl pointer-events-none"
          initial={{ top: "50%", left: "50%", scale: 1, opacity: 1 }}
          animate={{
            top: "1rem",
            left: "calc(100% - 4rem)",
            scale: 0.3,
            opacity: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductPhoto src={imageUrl} alt="" fill className="object-cover" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
