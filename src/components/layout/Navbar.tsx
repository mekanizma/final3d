"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogIn,
  Home,
  Package,
  ScanLine,
  Printer,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useAuthStore } from "@/store/authStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useIntl } from "@/components/i18n/IntlProvider";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { MobileNavMenu } from "@/components/layout/MobileNavMenu";
import { DesktopNavMenu } from "@/components/layout/DesktopNavMenu";
import type { NavLinkConfig } from "@/components/layout/NavMenuCard";

export function Navbar() {
  const { t } = useIntl();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartHydrated = useCartHydrated();
  const totalItems = useCartStore((s) => s.totalItems());
  const setOpen = useCartStore((s) => s.setOpen);
  const user = useAuthStore((s) => s.user);
  const badgeCount = cartHydrated ? totalItems : 0;

  const navLinks: NavLinkConfig[] = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/urunler", label: t("nav.products"), icon: Package },
    { href: "/3d-tarama", label: t("nav.scan3d"), icon: ScanLine },
    { href: "/ozel-baski", label: t("nav.customPrint"), icon: Printer },
    { href: "/order", label: t("nav.order"), icon: ClipboardList },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#12082a]/96 backdrop-blur-xl supports-[backdrop-filter]:bg-[#12082a]/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center gap-2 sm:gap-4 min-w-0">
          <LocaleLink
            href="/"
            className="flex items-center group shrink-0 overflow-visible py-0.5 -my-0.5"
          >
            <SiteLogo size="nav" />
          </LocaleLink>

          <DesktopNavMenu links={navLinks} />

          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0 ml-auto">
            <LanguageSwitcher compact className="lg:hidden" />
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            <div className="hidden lg:flex items-center gap-1.5">
              {user ? (
                <LocaleLink
                  href="/hesabim"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-violet-100/90 glass-hover"
                >
                  <User className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span className="truncate max-w-[8rem]">
                    {user.name.split(" ")[0]}
                  </span>
                </LocaleLink>
              ) : (
                <>
                  <LocaleLink
                    href="/giris"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-violet-200/80 hover:text-white hover:bg-white/[0.05] transition-colors whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4 shrink-0" strokeWidth={2} />
                    {t("nav.login")}
                  </LocaleLink>
                  <LocaleLink
                    href="/kayit-ol"
                    className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors whitespace-nowrap"
                  >
                    {t("nav.register")}
                  </LocaleLink>
                </>
              )}
            </div>

            <motion.button
              onClick={() => setOpen(true)}
              className="relative p-2 rounded-xl glass-hover shrink-0"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {badgeCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(232,121,249,0.6)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                >
                  {badgeCount}
                </motion.span>
              )}
            </motion.button>

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg shrink-0 border border-white/10 text-violet-100 hover:bg-white/[0.06] transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
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
      </header>

      <MobileNavMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        user={user}
        loginLabel={t("nav.login")}
        loginMobileLabel={t("nav.loginMobile")}
        registerLabel={t("nav.register")}
        accountLabel={t("nav.account")}
      />
      <CartDrawer />
    </>
  );
}
