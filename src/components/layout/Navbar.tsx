"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogIn } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { useAuthStore } from "@/store/authStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useIntl } from "@/components/i18n/IntlProvider";

export function Navbar() {
  const { t } = useIntl();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartHydrated = useCartHydrated();
  const authHydrated = useAuthHydrated();
  const totalItems = useCartStore((s) => s.totalItems());
  const setOpen = useCartStore((s) => s.setOpen);
  const user = useAuthStore((s) => s.user);
  const badgeCount = cartHydrated ? totalItems : 0;

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/urunler", label: t("nav.products") },
    { href: "/3d-tarama", label: t("nav.scan3d") },
    { href: "/ozel-baski", label: t("nav.customPrint") },
    { href: "/order", label: t("nav.order") },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#12082a]/96 backdrop-blur-xl supports-[backdrop-filter]:bg-[#12082a]/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-4">
          <LocaleLink href="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
              <span className="text-[11px] font-black tracking-tight text-white leading-none">
                F3
              </span>
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">
              Final<span className="text-neon">3d</span>
            </span>
          </LocaleLink>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center min-w-0">
            {navLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className="text-sm text-violet-200/70 hover:text-cyan-200 transition-colors whitespace-nowrap"
              >
                {link.label}
              </LocaleLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto lg:ml-0">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {authHydrated && (
              <>
                {user ? (
                  <LocaleLink
                    href="/hesabim"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-violet-100/90 glass-hover"
                  >
                    <User className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span className="max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </LocaleLink>
                ) : (
                  <>
                    <LocaleLink
                      href="/giris"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-violet-200/80 hover:text-white glass-hover"
                    >
                      <LogIn className="w-4 h-4" strokeWidth={2} />
                      {t("nav.login")}
                    </LocaleLink>
                    <LocaleLink
                      href="/kayit-ol"
                      className="hidden sm:inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-fuchsia-500/80 to-violet-600/80 text-white hover:opacity-90"
                    >
                      {t("nav.register")}
                    </LocaleLink>
                  </>
                )}
              </>
            )}

            <motion.button
              onClick={() => setOpen(true)}
              className="relative p-2 rounded-xl glass-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(232,121,249,0.6)]">
                  {badgeCount}
                </span>
              )}
            </motion.button>

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t("nav.menu")}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            className="lg:hidden absolute top-16 inset-x-0 z-[105] border-t border-white/10 px-4 py-4 flex flex-col gap-2 bg-[rgba(16,8,38,0.94)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="md:hidden mb-2">
              <LanguageSwitcher fullWidth />
            </div>
            {navLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className="text-sm text-violet-100/95 hover:text-white py-2.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </LocaleLink>
            ))}
            {authHydrated && (
              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                {user ? (
                  <LocaleLink
                    href="/hesabim"
                    className="text-sm text-violet-100/95 py-2.5 px-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {t("nav.account")}
                  </LocaleLink>
                ) : (
                  <>
                    <LocaleLink
                      href="/giris"
                      className="text-sm text-violet-100/95 py-2.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("nav.loginMobile")}
                    </LocaleLink>
                    <LocaleLink
                      href="/kayit-ol"
                      className="text-sm font-medium text-cyan-200 py-2.5 px-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("nav.register")}
                    </LocaleLink>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
