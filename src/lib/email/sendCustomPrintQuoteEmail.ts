import { buildCustomPrintQuoteEmail } from "@/lib/email/quoteEmailContent";
import {
  fileToAttachment,
  sendQuoteNotificationEmail,
  type SendQuoteNotificationResult,
} from "@/lib/email/sendQuoteNotification";
import type { CustomPrintRequest } from "@/services/customPrintService";

export async function sendCustomPrintQuoteEmail(
  request: CustomPrintRequest,
  modelFile: File | null
): Promise<SendQuoteNotificationResult> {
  const { subject, html, text } = buildCustomPrintQuoteEmail(request);
  const attachments = modelFile?.size
    ? [await fileToAttachment(modelFile)]
    : undefined;

  return sendQuoteNotificationEmail({
    subject,
    html,
    text,
    replyTo: request.email,
    attachments,
  });
}
