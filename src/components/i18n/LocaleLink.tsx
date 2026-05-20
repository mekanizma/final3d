"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { withLocale } from "@/lib/locale-path";
import { defaultLocale, isLocale } from "@/i18n/config";
import type { ComponentProps } from "react";

type NextLinkProps = ComponentProps<typeof NextLink>;

export function LocaleLink({ href, ...rest }: NextLinkProps) {
  const params = useParams();
  const raw = params?.locale;
  const locale = typeof raw === "string" && isLocale(raw) ? raw : defaultLocale;
  const path = typeof href === "string" ? href : href.pathname ?? "/";
  const full = withLocale(path, locale);
  return <NextLink href={full} {...rest} />;
}
