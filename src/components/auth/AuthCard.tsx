"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LocaleLink } from "@/components/i18n/LocaleLink";

interface AuthCardProps {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <motion.div
      className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-violet-200/70 text-sm">{subtitle}</p>
        </header>
        <GlassCard hover={false} className="p-6 sm:p-8">
          {children}
        </GlassCard>
        <p className="text-center text-sm text-violet-200/60 mt-6">{footer}</p>
      </div>
    </motion.div>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <LocaleLink
      href={href}
      className="text-cyan-300 hover:text-cyan-200 font-medium"
    >
      {children}
    </LocaleLink>
  );
}
