import { Suspense } from "react";
import { BillingHub } from "@/components/admin/BillingHub";

export default function AdminBillingPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-violet-200/60">Yükleniyor…</p>
      }
    >
      <BillingHub />
    </Suspense>
  );
}
