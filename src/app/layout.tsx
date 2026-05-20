import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://final3d.tr"
  ),
  title: {
    default: "FINAL3D | KKTC 3D Baskı, Tarama ve Prototip",
    template: "%s | FINAL3D",
  },
  description:
    "FINAL3D — Kuzey Kıbrıs'ta profesyonel 3D baskı, 3D tarama ve prototip üretimi. Lefkoşa, Girne, Gazimağusa. Kapıda ödeme.",
  keywords: [
    "3d baskı kktc",
    "3d tarama kktc",
    "3d printer kıbrıs",
    "prototip üretim",
    "final3d",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "FINAL3D",
    url: "https://final3d.tr",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased relative">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

