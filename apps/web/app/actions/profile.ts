"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/db";
import { isPostgresUndefinedColumnError } from "@/lib/drizzle/select-user-by-id";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

const QUOTE_COMPANY_MAX = 200;
const QUOTE_LETTERHEAD_MAX = 4000;

export async function updateQuoteBranding(input: {
  quoteCompanyName: string;
  quoteLetterhead: string;
}) {
  try {
    const userId = await requireUserId();
    const company = input.quoteCompanyName.trim();
    const letterhead = input.quoteLetterhead.trim();

    if (company.length > QUOTE_COMPANY_MAX) {
      return {
        error: `La raison sociale ne peut pas dépasser ${QUOTE_COMPANY_MAX} caractères.`,
      };
    }
    if (letterhead.length > QUOTE_LETTERHEAD_MAX) {
      return {
        error: `Le bloc en-tête ne peut pas dépasser ${QUOTE_LETTERHEAD_MAX} caractères.`,
      };
    }

    await db
      .update(users)
      .set({
        quoteCompanyName: company.length > 0 ? company : null,
        quoteLetterhead: letterhead.length > 0 ? letterhead : null,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true as const };
  } catch (error) {
    console.error("Error updating quote branding:", error);
    if (isPostgresUndefinedColumnError(error)) {
      return {
        error:
          "La base de données n’est pas à jour : exécutez `npm run db:migrate` dans apps/web, puis réessayez.",
      };
    }
    return { error: "Impossible d’enregistrer l’en-tête devis." };
  }
}

export async function updateUserFullName(fullName: string) {
  try {
    const userId = await requireUserId();

    // Validate full name
    const trimmedName = fullName.trim();
    if (trimmedName.length > 100) {
      return { error: "Full name must be 100 characters or less" };
    }

    // Update user's full name
    await db
      .update(users)
      .set({
        full_name: trimmedName || null, // Set to null if empty string
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating full name:", error);
    return { error: "Failed to update full name" };
  }
}
