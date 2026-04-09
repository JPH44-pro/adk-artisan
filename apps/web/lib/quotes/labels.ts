import type { QuoteStatus } from "@/lib/drizzle/schema";

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  rejected: "Refusé",
  expired: "Expiré",
};

export const QUOTE_STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "draft", label: QUOTE_STATUS_LABELS.draft },
  { value: "sent", label: QUOTE_STATUS_LABELS.sent },
  { value: "accepted", label: QUOTE_STATUS_LABELS.accepted },
  { value: "rejected", label: QUOTE_STATUS_LABELS.rejected },
  { value: "expired", label: QUOTE_STATUS_LABELS.expired },
];
