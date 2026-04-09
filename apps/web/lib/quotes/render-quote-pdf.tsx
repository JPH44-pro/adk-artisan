import { renderToBuffer } from "@react-pdf/renderer";
import type { QuotePdfPayload } from "@/lib/queries/quotes";
import { QuotePdfDocument } from "@/lib/quotes/quote-pdf-document";

export async function renderQuotePdfToBuffer(
  payload: QuotePdfPayload
): Promise<Buffer> {
  return renderToBuffer(<QuotePdfDocument {...payload} />);
}
