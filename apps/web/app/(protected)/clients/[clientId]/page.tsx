import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { getCurrentUserId, requireUserId } from "@/lib/auth";
import { queryClientByIdForUser } from "@/lib/queries/clients";
import { ClientDetailClient } from "@/components/clients/ClientDetailClient";

interface ClientDetailPageProps {
  params: Promise<{ clientId: string }>;
}

export async function generateMetadata({
  params,
}: ClientDetailPageProps): Promise<Metadata> {
  const { clientId } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return { title: "Client" };
  }
  const client = await queryClientByIdForUser(userId, clientId);
  if (!client) {
    return { title: "Client" };
  }
  return {
    title: client.name,
  };
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps): Promise<ReactElement> {
  const userId = await requireUserId();
  const { clientId } = await params;
  const client = await queryClientByIdForUser(userId, clientId);

  if (!client) {
    notFound();
  }

  return <ClientDetailClient client={client} />;
}
