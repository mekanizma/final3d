import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="relative z-10 pt-16">
          {children}
        </main>
      </PageTransition>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
