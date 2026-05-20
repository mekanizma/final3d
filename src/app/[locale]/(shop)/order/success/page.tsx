import { OrderSuccessClient } from "@/components/order/OrderSuccessClient";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; email?: string }>;
}) {
  const { id, email } = await searchParams;
  const emailStatus =
    email === "sent" || email === "mock" || email === "failed" ? email : null;

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <OrderSuccessClient orderId={id ?? null} emailStatus={emailStatus} />
    </div>
  );
}
