"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

/** Zustand persist localStorage yüklenene kadar false — SSR hydration uyumu için. */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  return hydrated;
}
