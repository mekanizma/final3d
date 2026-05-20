"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = async () => {
      await useAuthStore.persist.rehydrate();
      await useAuthStore.getState().hydrate();
      setHydrated(true);
    };
    void sync();
  }, []);

  return hydrated;
}
