import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | FINAL3D",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0618] text-[#faf5ff] antialiased">
      {children}
    </div>
  );
}
