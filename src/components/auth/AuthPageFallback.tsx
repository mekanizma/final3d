"use client";

import { useIntl } from "@/components/i18n/IntlProvider";

export function AuthPageFallback() {
  const { t } = useIntl();

  return (
    <div
      className="min-h-screen pt-24 flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-sm text-violet-200/60">{t("auth.pageLoading")}</p>
    </div>
  );
}
