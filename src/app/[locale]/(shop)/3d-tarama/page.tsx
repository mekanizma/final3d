import type { Metadata } from "next";
import { Scan3DSection } from "@/components/home/Scan3DSection";

export const metadata: Metadata = {
  title: "3D Tarama | Final3d",
  description:
    "Profesyonel el tipi 3D tarama, dijital model hazırlığı ve filament baskı — KKTC stüdyo ve saha hizmeti.",
};

export default function Scan3DPage() {
  return <Scan3DSection />;
}

