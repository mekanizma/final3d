"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/config";
import { getNested } from "@/i18n/resolve-message";

type Messages = Record<string, unknown>;

const IntlContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
} | null>(null);

export function IntlProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const t = useCallback(
    (key: string) => getNested(messages, key) ?? key,
    [messages]
  );

  const value = useMemo(() => ({ locale, t }), [locale, t]);

  return (
    <IntlContext.Provider value={value}>{children}</IntlContext.Provider>
  );
}

export function useIntl() {
  const ctx = useContext(IntlContext);
  if (!ctx) {
    throw new Error("useIntl must be used within IntlProvider");
  }
  return ctx;
}
