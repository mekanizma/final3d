"use client";

import { MapPin } from "lucide-react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";

export function Footer() {
  const { t } = useIntl();

  return (
    <footer className="relative z-10 border-t border-fuchsia-500/10 mt-20 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_10%_0%,rgba(232,121,249,0.14),transparent_55%)]"
        aria-hidden
      />
      <div className="section-glow mb-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <LocaleLink href="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
                <span className="text-[11px] font-black tracking-tight text-white leading-none">
                  F3
                </span>
              </div>
              <span className="font-bold text-lg">
                Final<span className="text-neon">3d</span>
              </span>
            </LocaleLink>
            <p className="text-sm text-violet-200/65 max-w-md leading-relaxed mt-4">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300/60 mb-3">
                {t("footer.quick")}
              </h4>
              <nav className="flex flex-col gap-2.5 text-sm text-violet-100/85">
                <LocaleLink
                  href="/urunler"
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t("nav.products")}
                </LocaleLink>
                <LocaleLink
                  href="/3d-tarama"
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t("nav.scan3d")}
                </LocaleLink>
                <LocaleLink
                  href="/ozel-baski"
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t("nav.customPrint")}
                </LocaleLink>
                <LocaleLink
                  href="/order"
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t("nav.order")}
                </LocaleLink>
              </nav>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300/60 mb-3">
                {t("footer.contact")}
              </h4>
              <div className="space-y-2 text-sm text-violet-100/85 leading-relaxed">
                <p>
                  <span className="text-violet-300/65">{t("footer.phone")}:</span>{" "}
                  <a
                    href="tel:+905338398293"
                    className="hover:text-cyan-300 transition-colors"
                  >
                    +90 533 839 82 93
                  </a>
                </p>
                <p>
                  <span className="text-violet-300/65">{t("footer.phone")}:</span>{" "}
                  <a
                    href="tel:+905338507761"
                    className="hover:text-cyan-300 transition-colors"
                  >
                    +90 533 850 77 61
                  </a>
                </p>
                <p>
                  <span className="text-violet-300/65">{t("footer.mail")}:</span>{" "}
                  <a
                    href="mailto:info@final3d.tr"
                    className="hover:text-cyan-300 transition-colors"
                  >
                    info@final3d.tr
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300/60 mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                {t("footer.location")}
              </h4>
              <address className="not-italic text-sm text-violet-100/85 leading-relaxed space-y-1">
                <p className="text-violet-200/75">{t("footer.university")}</p>
                <p className="font-semibold text-white/95">{t("footer.center")}</p>
                <p className="text-violet-200/65">
                  {t("footer.addressLine")}
                  <br />
                  {t("footer.addressCity")}
                </p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-violet-300/50">
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.taglineBottom")}</span>
        </div>
      </div>
    </footer>
  );
}
