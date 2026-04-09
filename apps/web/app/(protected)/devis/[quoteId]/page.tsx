import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { getCurrentUserId, requireUserId } from "@/lib/auth";
import { queryClientOptionsForUser } from "@/lib/queries/clients";
import { queryQuoteWithLinesForUser } from "@/lib/queries/quotes";
import { QuoteEditorClient } from "@/components/devis/QuoteEditorClient";

interface QuotePageProps {
  params: Promise<{ quoteId: string }>;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { quoteId } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return { title: "Devis" };
  }
  const data = await queryQuoteWithLinesForUser(userId, quoteId);
  if (!data) {
    return { title: "Devis" };
  }
  return {
    title: data.quote.title?.trim() || "Devis",
  };
}

export default async function DevisDetailPage({
  params,
}: QuotePageProps): Promise<ReactElement> {
  const userId = await requireUserId();
  const { quoteId } = await params;
  const data = await queryQuoteWithLinesForUser(userId, quoteId);
  if (!data) {
    notFound();
  }

  const clientOptions = await queryClientOptionsForUser(userId);

  return (
    <QuoteEditorClient
      quote={data.quote}
      lines={data.lines}
      clientOptions={clientOptions}
    />
  );
}
