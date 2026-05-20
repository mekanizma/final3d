import type { QuoteNotificationResult } from "@/services/customPrintService";

export function quoteEmailNotifyMessage(
  notification: QuoteNotificationResult | undefined,
  t: (key: string) => string
): "ok" | "mock" | "fail" {
  if (!notification) return "ok";
  if (notification.sent) return "ok";
  if (notification.mock) return "mock";
  return "fail";
}

export function quoteEmailFailAlert(
  notification: QuoteNotificationResult | undefined,
  t: (key: string) => string
): void {
  const status = quoteEmailNotifyMessage(notification, t);
  if (status === "mock") {
    alert(t("quoteForm.emailMock"));
    return;
  }
  if (status === "fail") {
    alert(
      notification?.error
        ? `${t("quoteForm.emailFail")}\n${notification.error}`
        : t("quoteForm.emailFail")
    );
  }
}
