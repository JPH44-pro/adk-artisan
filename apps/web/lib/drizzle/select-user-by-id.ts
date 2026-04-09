import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import { users, type User } from "@/lib/drizzle/schema";

/**
 * Détecte l’erreur PG « colonne inexistante » (ex. schéma pas encore migré).
 */
export function isPostgresUndefinedColumnError(error: unknown): boolean {
  let cur: unknown = error;
  for (let depth = 0; depth < 8 && cur !== undefined && cur !== null; depth++) {
    if (typeof cur === "object" && "code" in cur) {
      const code = (cur as { code: unknown }).code;
      if (code === "42703") {
        return true;
      }
    }
    cur =
      typeof cur === "object" && cur !== null && "cause" in cur
        ? (cur as { cause: unknown }).cause
        : undefined;
  }
  return false;
}

/**
 * Charge une ligne `users` complète. Si les colonnes d’en-tête devis ne sont pas
 * encore en base (migration non appliquée), retombe sur un SELECT réduit et des
 * champs null pour rester compatible.
 */
export async function selectUserByIdFullOrLegacy(
  userId: string
): Promise<User | undefined> {
  try {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return row;
  } catch (error) {
    if (!isPostgresUndefinedColumnError(error)) {
      throw error;
    }

    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        created_at: users.created_at,
        updated_at: users.updated_at,
        stripe_customer_id: users.stripe_customer_id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!row) {
      return undefined;
    }

    return {
      ...row,
      quoteCompanyName: null,
      quoteLetterhead: null,
    };
  }
}
