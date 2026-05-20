import { Resend } from "resend";
import { SITE_EMAIL } from "@/lib/seo/constants";

export type QuoteEmailAttachment = {
  filename: string;
  content: Buffer;
};

export type SendQuoteNotificationResult = {
  sent: boolean;
  mock?: boolean;
  error?: string;
  messageId?: string;
};

function getQuoteRecipient(): string | null {
  return (
    process.env.ADMIN_ORDER_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    SITE_EMAIL
  );
}

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from:
      process.env.EMAIL_FROM ?? "Final3d <onboarding@resend.dev>",
  };
}

export async function sendQuoteNotificationEmail(input: {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
  attachments?: QuoteEmailAttachment[];
}): Promise<SendQuoteNotificationResult> {
  const to = getQuoteRecipient();
  if (!to) {
    return { sent: false, error: "Alıcı e-posta adresi yapılandırılmamış." };
  }

  const { apiKey, from } = getEmailConfig();

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email:mock] Teklif bildirimi simüle:", {
        to,
        subject: input.subject,
        attachments: input.attachments?.map((a) => a.filename),
      });
    }
    return { sent: false, mock: true };
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    if (error) {
      console.error("[email] Teklif bildirimi hatası:", error);
      return { sent: false, error: error.message };
    }

    return { sent: true, messageId: data?.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "E-posta gönderilemedi";
    console.error("[email]", message);
    return { sent: false, error: message };
  }
}

export async function fileToAttachment(
  file: File
): Promise<QuoteEmailAttachment> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[/\\?%*:|"<>]/g, "_") || "attachment";
  return { filename: safeName, content: buffer };
}
