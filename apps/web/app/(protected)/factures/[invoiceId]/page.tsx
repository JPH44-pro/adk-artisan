import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { getCurrentUserId, requireUserId } from "@/lib/auth";
import { queryClientOptionsForUser } from "@/lib/queries/clients";
import { queryInvoiceWithLinesForUser } from "@/lib/queries/invoices";
import { InvoiceEditorClient } from "@/components/factures/InvoiceEditorClient";

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
}

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { invoiceId } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return { title: "Facture" };
  }
  const data = await queryInvoiceWithLinesForUser(userId, invoiceId);
  if (!data) {
    return { title: "Facture" };
  }
  return {
    title: data.invoice.title?.trim() || "Facture",
  };
}

export default async function FactureDetailPage({
  params,
}: InvoicePageProps): Promise<ReactElement> {
  const userId = await requireUserId();
  const { invoiceId } = await params;
  const data = await queryInvoiceWithLinesForUser(userId, invoiceId);
  if (!data) {
    notFound();
  }

  const clientOptions = await queryClientOptionsForUser(userId);

  return (
    <InvoiceEditorClient
      invoice={data.invoice}
      lines={data.lines}
      clientOptions={clientOptions}
    />
  );
}
