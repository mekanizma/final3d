import type { Metadata } from "next";
import { ScanQuoteForm } from "@/components/scan/ScanQuoteForm";

export const metadata: Metadata = {
  title: "3D Tarama Teklifi | Final3d",
  description:
    "3D tarama teklif formu — nesne boyutu, konum, adet ve referans fotoğraf ile talep oluşturun.",
};

export default function ScanQuotePage() {
  return (
    <div className="pt-24 sm:pt-28">
      <ScanQuoteForm />
    </div>
  );
}

