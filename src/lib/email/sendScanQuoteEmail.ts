import { buildScanQuoteEmail } from "@/lib/email/quoteEmailContent";
import {
  fileToAttachment,
  sendQuoteNotificationEmail,
  type SendQuoteNotificationResult,
} from "@/lib/email/sendQuoteNotification";
import type { ScanQuoteRequest } from "@/services/scanRequestService";

export async function sendScanQuoteEmail(
  request: ScanQuoteRequest,
  photoFile: File | null
): Promise<SendQuoteNotificationResult> {
  const { subject, html, text } = buildScanQuoteEmail(request);
  const attachments = photoFile?.size
    ? [await fileToAttachment(photoFile)]
    : undefined;

  return sendQuoteNotificationEmail({
    subject,
    html,
    text,
    replyTo: request.email,
    attachments,
  });
}
