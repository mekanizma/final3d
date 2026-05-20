"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = async () => {
      try {
        await useAuthStore.persist.rehydrate();
        await useAuthStore.getState().hydrate();
      } catch {
        /* API yoksa bile giriş/kayıt butonları görünsün */
      } finally {
        setHydrated(true);
      }
    };
    void sync();
  }, []);

  return hydrated;
}
