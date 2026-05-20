"use client";

import { useEffect } from "react";
import {
  clearLegacyMockStorageOnce,
  purgeLegacyCartEachVisit,
} from "@/lib/clearLegacyMockStorage";

/** Eski mock localStorage ve sepetteki demo ürünleri temizler */
export function ClearLegacyStorage({ shopOnly }: { shopOnly?: boolean }) {
  useEffect(() => {
    if (shopOnly) {
      purgeLegacyCartEachVisit();
    } else {
      clearLegacyMockStorageOnce();
      purgeLegacyCartEachVisit();
    }
  }, [shopOnly]);
  return null;
}
