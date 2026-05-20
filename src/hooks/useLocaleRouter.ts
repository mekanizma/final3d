"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { withLocale } from "@/lib/locale-path";
import { defaultLocale, isLocale } from "@/i18n/config";

export function useLocaleRouter() {
  const router = useRouter();
  const params = useParams();
  const raw = params?.locale;
  const locale =
    typeof raw === "string" && isLocale(raw) ? raw : defaultLocale;

  const push = useCallback(
    (path: string) => {
      router.push(withLocale(path, locale));
    },
    [router, locale]
  );

  const replace = useCallback(
    (path: string) => {
      router.replace(withLocale(path, locale));
    },
    [router, locale]
  );

  return { push, replace, locale };
}
