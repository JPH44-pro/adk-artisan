"use client";

import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClientFormInput } from "@/app/actions/clients";
import type { Client } from "@/lib/drizzle/schema";

function clientToFormDefaults(c: Client): ClientFormInput {
  return {
    name: c.name,
    companyName: c.companyName ?? undefined,
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    addressLine1: c.addressLine1 ?? undefined,
    city: c.city ?? undefined,
    postalCode: c.postalCode ?? undefined,
    country: c.country,
    notes: c.notes ?? undefined,
  };
}

interface ClientFormProps {
  client?: Client;
  submitLabel: string;
  onSubmit: (data: ClientFormInput) => Promise<{ error?: string } | void>;
}

export function ClientForm({
  client,
  submitLabel,
  onSubmit,
}: ClientFormProps): ReactElement {
  const defaults = client ? clientToFormDefaults(client) : undefined;
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    const payload: ClientFormInput = {
      name: String(fd.get("name") ?? ""),
      companyName: String(fd.get("companyName") ?? "") || undefined,
      email: String(fd.get("email") ?? "") || undefined,
      phone: String(fd.get("phone") ?? "") || undefined,
      addressLine1: String(fd.get("addressLine1") ?? "") || undefined,
      city: String(fd.get("city") ?? "") || undefined,
      postalCode: String(fd.get("postalCode") ?? "") || undefined,
      country: String(fd.get("country") ?? "FR") || "FR",
      notes: String(fd.get("notes") ?? "") || undefined,
    };

    setPending(true);
    try {
      const result = await onSubmit(payload);
      if (result && "error" in result && result.error) {
        setFormError(result.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">Nom ou contact *</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={200}
          defaultValue={defaults?.name ?? ""}
          placeholder="Ex. Dupont, Entreprise Martin…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Raison sociale</Label>
        <Input
          id="companyName"
          name="companyName"
          maxLength={200}
          defaultValue={defaults?.companyName ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            maxLength={320}
            autoComplete="email"
            defaultValue={defaults?.email ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            maxLength={50}
            autoComplete="tel"
            defaultValue={defaults?.phone ?? ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Adresse</Label>
        <Input
          id="addressLine1"
          name="addressLine1"
          maxLength={300}
          defaultValue={defaults?.addressLine1 ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="postalCode">Code postal</Label>
          <Input
            id="postalCode"
            name="postalCode"
            maxLength={20}
            defaultValue={defaults?.postalCode ?? ""}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            maxLength={120}
            defaultValue={defaults?.city ?? ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Pays (code ISO)</Label>
        <Input
          id="country"
          name="country"
          maxLength={2}
          defaultValue={defaults?.country ?? "FR"}
          className="uppercase"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={8000}
          defaultValue={defaults?.notes ?? ""}
          placeholder="Accès chantier, préférences, rappels…"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : submitLabel}
      </Button>
    </form>
  );
}
