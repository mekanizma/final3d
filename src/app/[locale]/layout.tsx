import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { loadMessages } from "@/i18n/load-messages";
import { IntlProvider } from "@/components/i18n/IntlProvider";
import { LangAttributes } from "@/components/i18n/LangAttributes";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const messages = loadMessages(locale);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <LangAttributes locale={locale} />
      {children}
    </IntlProvider>
  );
}
