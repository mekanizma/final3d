"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Menu,
  X,
  Home,
  Calculator,
  LogOut,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { getLocaleFromPathname, stripLocalePath, withLocale } from "@/lib/locale-path";
import { SiteLogo } from "@/components/brand/SiteLogo";

const links = [
  { href: "/admin", labelKey: "adminNav.dashboard", icon: LayoutDashboard },
  { href: "/admin/products", labelKey: "adminNav.products", icon: Package },
  { href: "/admin/orders", labelKey: "adminNav.orders", icon: ShoppingBag },
  { href: "/admin/teklifler", labelKey: "adminNav.quotes", icon: FileText },
  { href: "/admin/hesaplama", labelKey: "adminNav.pricing", icon: Calculator },
] as const;

export function AdminSidebar() {
  const { t } = useIntl();
  const pathname = usePathname() || "/";
  const innerPath = stripLocalePath(pathname);
  const locale = getLocaleFromPathname(pathname);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleAdminLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = withLocale("/admin/giris", locale);
    }
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl"
        onClick={() => setOpen(!open)}
        aria-label={t("nav.menu")}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <motion.aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 w-64 glass border-r border-white/5 flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-white/5">
          <LocaleLink href="/admin" className="flex flex-col gap-2">
            <SiteLogo size="md" />
            <p className="text-xs text-violet-300/60">{t("adminNav.panel")}</p>
          </LocaleLink>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? innerPath === "/admin"
                : innerPath.startsWith(link.href);
            const Icon = link.icon;
            return (
              <LocaleLink
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                  active
                    ? "bg-gradient-to-r from-fuchsia-500/25 to-cyan-500/15 text-white border border-fuchsia-400/30"
                    : "text-violet-100/80 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
                {t(link.labelKey)}
                {active && (
                  <motion.div
                    layoutId="admin-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                  />
                )}
              </LocaleLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleAdminLogout}
            className="flex w-full items-center gap-2 px-4 py-3 rounded-xl text-sm text-rose-200/90 hover:bg-rose-500/15 hover:text-rose-100 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
            {loggingOut ? t("adminNav.loggingOut") : t("adminNav.logout")}
          </button>
          <LocaleLink
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-violet-100/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
            {t("adminNav.backShop")}
          </LocaleLink>
        </div>
      </motion.aside>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
