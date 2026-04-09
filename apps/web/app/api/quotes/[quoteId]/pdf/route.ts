import { getCurrentUserId } from "@/lib/auth";
import { queryQuotePdfPayloadForUser } from "@/lib/queries/quotes";
import { renderQuotePdfToBuffer } from "@/lib/quotes/render-quote-pdf";

function buildPdfFilename(reference: string | null, quoteId: string): string {
  const fromRef = reference
    ?.trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const base =
    fromRef && fromRef.length > 0 ? `devis-${fromRef}` : `devis-${quoteId.slice(0, 8)}`;
  return `${base}.pdf`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ quoteId: string }> }
): Promise<Response> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { quoteId } = await context.params;
  const payload = await queryQuotePdfPayloadForUser(userId, quoteId);
  if (!payload) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const buffer = await renderQuotePdfToBuffer(payload);
    const filename = buildPdfFilename(payload.quote.reference, quoteId);
    const encoded = encodeURIComponent(filename);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encoded}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("quote pdf render error", e);
    return new Response("PDF generation failed", { status: 500 });
  }
}
