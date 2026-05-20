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
  title: "Final3d | 3D Baskı Ürünleri",
  description:
    "Kuzey Kıbrıs'ın premium 3D baskı ürünleri platformu. Yazıcılar, filamentler, modeller ve aksesuarlar. Kapıda ödeme.",
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

