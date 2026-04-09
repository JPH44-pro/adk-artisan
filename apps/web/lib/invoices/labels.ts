import type { InvoiceStatus } from "@/lib/drizzle/schema";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
  cancelled: "Annulée",
};

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] =
  [
    { value: "draft", label: INVOICE_STATUS_LABELS.draft },
    { value: "sent", label: INVOICE_STATUS_LABELS.sent },
    { value: "paid", label: INVOICE_STATUS_LABELS.paid },
    { value: "overdue", label: INVOICE_STATUS_LABELS.overdue },
    { value: "cancelled", label: INVOICE_STATUS_LABELS.cancelled },
  ];
