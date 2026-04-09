import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { QuotePdfPayload } from "@/lib/queries/quotes";
import { formatCentsEUR } from "@/lib/quotes/calc";
import { QUOTE_STATUS_LABELS } from "@/lib/quotes/labels";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111",
  },
  issuerBlock: { marginBottom: 16 },
  issuerTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  issuerLine: { marginBottom: 2 },
  docTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  metaRow: { flexDirection: "row", marginBottom: 4, flexWrap: "wrap" },
  metaLabel: { width: 110, fontFamily: "Helvetica-Bold" },
  metaValue: { flex: 1 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 6,
  },
  clientLine: { marginBottom: 2 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 4,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  colLabel: { width: "42%" },
  colQty: { width: "12%", textAlign: "right" },
  colPu: { width: "20%", textAlign: "right" },
  colTot: { width: "26%", textAlign: "right" },
  th: { fontFamily: "Helvetica-Bold", fontSize: 8 },
  totalsBox: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalStrong: { fontFamily: "Helvetica-Bold" },
  notes: { marginTop: 20, fontSize: 8, lineHeight: 1.4 },
  footerHint: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 7,
    color: "#666",
  },
});

function formatDateFr(d: Date | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatQtyDisplay(raw: string): string {
  const n = raw.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(n)) return raw;
  return n.replace(".", ",");
}

function vatPercentLabel(bps: number): string {
  return `${(bps / 100).toFixed(2).replace(".", ",")} %`;
}

function issuerDisplayName(payload: QuotePdfPayload): string {
  const { issuer } = payload;
  return (
    issuer.quoteCompanyName?.trim() ||
    issuer.fullName?.trim() ||
    issuer.email
  );
}

function clientLines(payload: QuotePdfPayload): string[] {
  const c = payload.client;
  if (!c) return [];
  const lines: string[] = [];
  const mainName = c.companyName?.trim() || c.name;
  lines.push(mainName);
  if (c.companyName?.trim() && c.name !== mainName) {
    lines.push(c.name);
  }
  if (c.addressLine1?.trim()) lines.push(c.addressLine1.trim());
  const cityLine = [c.postalCode, c.city].filter(Boolean).join(" ").trim();
  if (cityLine) lines.push(cityLine);
  if (c.country && c.country !== "FR") lines.push(c.country);
  if (c.email?.trim()) lines.push(c.email.trim());
  if (c.phone?.trim()) lines.push(c.phone.trim());
  return lines;
}

export function QuotePdfDocument(payload: QuotePdfPayload) {
  const { quote, lines, issuer } = payload;
  const issuerTitle = issuerDisplayName(payload);
  const letterheadLines =
    issuer.quoteLetterhead
      ?.split(/\r?\n/)
      .map((l) => l.trimEnd())
      .filter((l) => l.length > 0) ?? [];

  const notesLines =
    quote.notes
      ?.split(/\r?\n/)
      .map((l) => l.trimEnd())
      .filter((l) => l.length > 0) ?? [];

  const clientBlock = clientLines(payload);

  return (
    <Document
      title={quote.title?.trim() || "Devis"}
      author={issuerTitle}
      language="fr-FR"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.issuerBlock}>
          <Text style={styles.issuerTitle}>{issuerTitle}</Text>
          {issuer.quoteCompanyName?.trim() && issuer.fullName?.trim() ? (
            <Text style={styles.issuerLine}>{issuer.fullName.trim()}</Text>
          ) : null}
          {letterheadLines.map((line, i) => (
            <Text key={`lh-${i}`} style={styles.issuerLine}>
              {line}
            </Text>
          ))}
          {issuer.email && issuer.email !== issuerTitle ? (
            <Text style={styles.issuerLine}>{issuer.email}</Text>
          ) : null}
        </View>

        <Text style={styles.docTitle}>Devis</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Référence</Text>
          <Text style={styles.metaValue}>
            {quote.reference?.trim() || "—"}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Objet</Text>
          <Text style={styles.metaValue}>{quote.title?.trim() || "—"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>{formatDateFr(quote.createdAt)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Valable jusqu’au</Text>
          <Text style={styles.metaValue}>
            {formatDateFr(quote.validUntil)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Statut</Text>
          <Text style={styles.metaValue}>
            {QUOTE_STATUS_LABELS[quote.status]}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Client</Text>
        {clientBlock.length === 0 ? (
          <Text style={styles.clientLine}>—</Text>
        ) : (
          clientBlock.map((line, i) => (
            <Text key={`cl-${i}`} style={styles.clientLine}>
              {line}
            </Text>
          ))
        )}

        <View style={styles.tableHeader}>
          <Text style={[styles.colLabel, styles.th]}>Désignation</Text>
          <Text style={[styles.colQty, styles.th]}>Qté</Text>
          <Text style={[styles.colPu, styles.th]}>PU HT</Text>
          <Text style={[styles.colTot, styles.th]}>Total HT</Text>
        </View>
        {lines.map((line) => (
          <View key={line.id} style={styles.tableRow} wrap={false}>
            <Text style={styles.colLabel}>{line.label}</Text>
            <Text style={styles.colQty}>{formatQtyDisplay(line.quantity)}</Text>
            <Text style={styles.colPu}>
              {formatCentsEUR(line.unitPriceHtCents)}
            </Text>
            <Text style={styles.colTot}>
              {formatCentsEUR(line.lineTotalHtCents)}
            </Text>
          </View>
        ))}

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text>Total HT</Text>
            <Text>{formatCentsEUR(quote.subtotalHtCents)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>TVA ({vatPercentLabel(quote.vatRateBps)})</Text>
            <Text>{formatCentsEUR(quote.vatCents)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalStrong}>Total TTC</Text>
            <Text style={styles.totalStrong}>
              {formatCentsEUR(quote.totalTtcCents)}
            </Text>
          </View>
        </View>

        {notesLines.length > 0 ? (
          <View style={styles.notes}>
            <Text style={styles.totalStrong}>Notes</Text>
            {notesLines.map((line, i) => (
              <Text key={`n-${i}`} wrap>
                {line}
              </Text>
            ))}
          </View>
        ) : null}

        <Text style={styles.footerHint} fixed>
          Document généré depuis ReglePro — montants exprimés en euros.
        </Text>
      </Page>
    </Document>
  );
}
