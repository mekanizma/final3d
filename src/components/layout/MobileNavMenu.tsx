"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogIn } from "lucide-react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { stripLocalePath } from "@/lib/locale-path";
import { cn } from "@/lib/utils";
import {
  NavMenuCard,
  navMenuItemVariants,
  type NavLinkConfig,
} from "@/components/layout/NavMenuCard";

const listVariants = {
  closed: {},
  open: {
    transition: { staggerChildren: 0.04, delayChildren: 0.03 },
  },
};

function MobileAuthButton({
  href,
  onClick,
  variant,
  children,
}: {
  href: string;
  onClick: () => void;
  variant: "ghost" | "primary";
  children: ReactNode;
}) {
  return (
    <LocaleLink href={href} onClick={onClick} className="block">
      <span
        className={cn(
          "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors duration-200",
          variant === "primary"
            ? "bg-violet-600 text-white hover:bg-violet-500 shadow-sm"
            : "border border-white/12 bg-transparent text-violet-100 hover:bg-white/[0.05] hover:border-white/18"
        )}
      >
        {children}
      </span>
    </LocaleLink>
  );
}

export function MobileNavMenu({
  open,
  onClose,
  links,
  user,
  loginLabel,
  loginMobileLabel,
  registerLabel,
  accountLabel,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLinkConfig[];
  user: { name: string } | null;
  loginLabel: string;
  loginMobileLabel: string;
  registerLabel: string;
  accountLabel: string;
}) {
  const pathname = usePathname() || "/";
  const innerPath = stripLocalePath(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const panel = (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Menüyü kapat"
            className="lg:hidden fixed inset-0 top-16 z-[200] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.div
            className="lg:hidden fixed inset-x-0 top-16 z-[201] flex flex-col bg-[#100c1f] border-t border-white/10 shadow-2xl"
            style={{ height: "calc(100dvh - 4rem)", maxHeight: "calc(100dvh - 4rem)" }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-5 pb-10">
              <motion.div
                variants={listVariants}
                initial="closed"
                animate="open"
                className="space-y-6"
              >
                <motion.div variants={navMenuItemVariants}>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-violet-400/70 mb-2 px-1">
                    Dil
                  </p>
                  <div className="rounded-xl border border-white/10 bg-[#16122a] p-0.5">
                    <LanguageSwitcher fullWidth />
                  </div>
                </motion.div>

                <motion.div variants={navMenuItemVariants}>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-violet-400/70 mb-2 px-1">
                    Sayfalar
                  </p>
                  <div className="rounded-xl border border-white/10 bg-[#16122a] overflow-hidden divide-y divide-white/[0.06]">
                    {links.map((link) => {
                      const active =
                        link.href === "/"
                          ? innerPath === "/"
                          : innerPath.startsWith(link.href);
                      return (
                        <NavMenuCard
                          key={link.href}
                          {...link}
                          active={active}
                          variant="mobile"
                          onNavigate={onClose}
                          motionVariant
                        />
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  variants={navMenuItemVariants}
                  className="space-y-2 pt-2"
                >
                  <p className="text-[11px] font-medium uppercase tracking-widest text-violet-400/70 mb-2 px-1">
                    Hesap
                  </p>
                  {user ? (
                    <MobileAuthButton
                      href="/hesabim"
                      onClick={onClose}
                      variant="ghost"
                    >
                      <User className="w-4 h-4 text-violet-300" />
                      {accountLabel}
                    </MobileAuthButton>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <MobileAuthButton
                        href="/giris"
                        onClick={onClose}
                        variant="ghost"
                      >
                        <LogIn className="w-4 h-4 text-violet-300" />
                        {loginMobileLabel || loginLabel}
                      </MobileAuthButton>
                      <MobileAuthButton
                        href="/kayit-ol"
                        onClick={onClose}
                        variant="primary"
                      >
                        {registerLabel}
                      </MobileAuthButton>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(panel, document.body);
}
