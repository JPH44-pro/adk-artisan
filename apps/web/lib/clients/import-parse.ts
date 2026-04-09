/** Même forme que le formulaire client (validation côté action). */
export type ClientImportRecord = {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  postalCode?: string;
  country: string;
  notes?: string;
};

export type ClientImportField = keyof ClientImportRecord;

function slugHeader(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

const HEADER_SLUG_TO_FIELD: Record<string, ClientImportField> = {
  nom: "name",
  name: "name",
  client: "name",
  contact: "name",
  societe: "companyName",
  entreprise: "companyName",
  company: "companyName",
  company_name: "companyName",
  companyname: "companyName",
  raison_sociale: "companyName",
  raisonsociale: "companyName",
  email: "email",
  e_mail: "email",
  mail: "email",
  courriel: "email",
  telephone: "phone",
  tel: "phone",
  phone: "phone",
  portable: "phone",
  mobile: "phone",
  adresse: "addressLine1",
  address: "addressLine1",
  rue: "addressLine1",
  ligne1: "addressLine1",
  address_line1: "addressLine1",
  addressline1: "addressLine1",
  ville: "city",
  city: "city",
  localite: "city",
  localité: "city",
  code_postal: "postalCode",
  codepostal: "postalCode",
  cp: "postalCode",
  postal_code: "postalCode",
  postalcode: "postalCode",
  zip: "postalCode",
  pays: "country",
  country: "country",
  notes: "notes",
  remarques: "notes",
  commentaires: "notes",
};

function cellToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return String(v).trim();
}

export type ParsedImportRow = {
  lineNumber: number;
  data: ClientImportRecord;
};

/**
 * Première ligne non vide = en-têtes ; lignes suivantes = données.
 * Les lignes sans « nom » sont ignorées.
 */
export function parseClientImportMatrix(
  matrix: unknown[][]
): { rows: ParsedImportRow[]; warnings: string[] } {
  const warnings: string[] = [];
  const rows: ParsedImportRow[] = [];

  if (!matrix.length) {
    return { rows: [], warnings: ["Le fichier ne contient aucune ligne."] };
  }

  let headerRowIndex = -1;
  const colToField: Partial<Record<number, ClientImportField>> = {};

  for (let r = 0; r < matrix.length; r += 1) {
    const row = matrix[r] ?? [];
    const cells = row.map(cellToString);
    if (cells.every((c) => c === "")) continue;

    if (headerRowIndex === -1) {
      headerRowIndex = r;
      cells.forEach((cell, col) => {
        if (!cell) return;
        const slug = slugHeader(cell);
        const field = HEADER_SLUG_TO_FIELD[slug];
        if (field) {
          colToField[col] = field;
        } else {
          warnings.push(
            `Colonne ignorée « ${cell} » (ligne ${r + 1}) — en-tête non reconnu.`
          );
        }
      });
      if (Object.keys(colToField).length === 0) {
        return {
          rows: [],
          warnings: [
            ...warnings,
            "Aucune colonne reconnue. Utilisez par ex. : nom, email, téléphone, ville…",
          ],
        };
      }
      continue;
    }

    const record: Partial<Record<ClientImportField, string>> = {};
    for (const [colStr, field] of Object.entries(colToField)) {
      if (field === undefined) continue;
      const col = Number(colStr);
      const val = cellToString(row[col]);
      if (val) {
        const prev = record[field];
        record[field] = prev ? `${prev} ${val}`.trim() : val;
      }
    }

    const name = (record.name ?? "").trim();
    if (!name) {
      continue;
    }

    const data: ClientImportRecord = {
      name,
      companyName: record.companyName,
      email: record.email,
      phone: record.phone,
      addressLine1: record.addressLine1,
      city: record.city,
      postalCode: record.postalCode,
      country: record.country ?? "FR",
      notes: record.notes,
    };

    rows.push({ lineNumber: r + 1, data });
  }

  return { rows, warnings };
}
