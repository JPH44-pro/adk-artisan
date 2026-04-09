"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAgendaEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
} from "@/app/actions/agenda";
import { addUtcDays } from "@/lib/agenda/week";

export type AgendaEventSerializable = {
  id: string;
  userId: string;
  clientId: string | null;
  title: string;
  notes: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  clientName: string | null;
};

interface AgendaPageClientProps {
  weekMondayYmd: string;
  prevWeekYmd: string;
  nextWeekYmd: string;
  events: AgendaEventSerializable[];
  clientOptions: { id: string; name: string }[];
}

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultNewRange(): { start: string; end: string } {
  const s = new Date();
  s.setSeconds(0, 0);
  s.setMinutes(0);
  s.setHours(s.getHours() + 1);
  const e = new Date(s);
  e.setHours(e.getHours() + 1);
  return { start: toDatetimeLocalValue(s), end: toDatetimeLocalValue(e) };
}

function formatTimeRangeFr(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };
  return `${start.toLocaleTimeString("fr-FR", opts)} – ${end.toLocaleTimeString("fr-FR", opts)} (UTC)`;
}

function formatDayHeaderUtc(day: Date): string {
  return day.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function AgendaPageClient({
  weekMondayYmd,
  prevWeekYmd,
  nextWeekYmd,
  events,
  clientOptions,
}: AgendaPageClientProps): ReactElement {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const mondayUtc = useMemo(() => {
    const [y, m, d] = weekMondayYmd.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }, [weekMondayYmd]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      days.push(addUtcDays(mondayUtc, i));
    }
    return days;
  }, [mondayUtc]);

  const byDay = useMemo(() => {
    const map = new Map<string, AgendaEventSerializable[]>();
    for (const day of weekDays) {
      map.set(day.toISOString().slice(0, 10), []);
    }
    for (const ev of events) {
      const start = new Date(ev.startAt);
      const key = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
      )
        .toISOString()
        .slice(0, 10);
      const list = map.get(key);
      if (list) {
        list.push(ev);
      }
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );
    }
    return map;
  }, [events, weekDays]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AgendaEventSerializable | null>(null);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  function openCreate(): void {
    setEditing(null);
    const r = defaultNewRange();
    setTitle("");
    setNotes("");
    setLocation("");
    setClientId("");
    setStartLocal(r.start);
    setEndLocal(r.end);
    setDialogOpen(true);
  }

  function openEdit(ev: AgendaEventSerializable): void {
    setEditing(ev);
    setTitle(ev.title);
    setNotes(ev.notes ?? "");
    setLocation(ev.location ?? "");
    setClientId(ev.clientId ?? "");
    setStartLocal(toDatetimeLocalValue(new Date(ev.startAt)));
    setEndLocal(toDatetimeLocalValue(new Date(ev.endAt)));
    setDialogOpen(true);
  }

  function handleSubmit(): void {
    startTransition(async () => {
      const startIso = new Date(startLocal).toISOString();
      const endIso = new Date(endLocal).toISOString();

      if (editing) {
        const result = await updateAgendaEvent({
          id: editing.id,
          title,
          notes: notes || undefined,
          location: location || undefined,
          clientId: clientId || undefined,
          startAt: startIso,
          endAt: endIso,
        });
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Rendez-vous enregistré");
      } else {
        const result = await createAgendaEvent({
          title,
          notes: notes || undefined,
          location: location || undefined,
          clientId: clientId || undefined,
          startAt: startIso,
          endAt: endIso,
        });
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Rendez-vous créé");
      }
      setDialogOpen(false);
      router.refresh();
    });
  }

  function handleDelete(): void {
    if (!editing) return;
    startTransition(async () => {
      const result = await deleteAgendaEvent(editing.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Rendez-vous supprimé");
      setDeleteOpen(false);
      setDialogOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Semaine affichée en UTC (cohérent avec le filtre). Liez un client
            optionnel ou un lieu de chantier.
          </p>
        </div>
        <Button type="button" onClick={openCreate} disabled={pending}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/agenda?week=${prevWeekYmd}`} aria-label="Semaine précédente">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm font-medium tabular-nums min-w-[10rem] text-center">
            {weekMondayYmd.replace(
              /^(\d{4})-(\d{2})-(\d{2})$/,
              "$3/$2/$1"
            )}
            {" · "}
            semaine UTC
          </span>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/agenda?week=${nextWeekYmd}`} aria-label="Semaine suivante">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/agenda">Cette semaine</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const key = day.toISOString().slice(0, 10);
          const dayEvents = byDay.get(key) ?? [];
          return (
            <div
              key={key}
              className="rounded-lg border bg-card p-3 min-h-[120px] flex flex-col gap-2"
            >
              <div className="text-xs font-medium text-muted-foreground capitalize border-b pb-2">
                {formatDayHeaderUtc(day)}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {dayEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">—</p>
                ) : (
                  dayEvents.map((ev) => {
                    const s = new Date(ev.startAt);
                    const e = new Date(ev.endAt);
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => openEdit(ev)}
                        className="text-left rounded-md border bg-background px-2 py-1.5 text-xs hover:bg-muted/60 transition-colors"
                      >
                        <div className="font-medium line-clamp-2">{ev.title}</div>
                        <div className="text-muted-foreground tabular-nums">
                          {formatTimeRangeFr(s, e)}
                        </div>
                        {ev.clientName ? (
                          <div className="text-muted-foreground truncate mt-0.5">
                            {ev.clientName}
                          </div>
                        ) : null}
                        {ev.location ? (
                          <div className="text-muted-foreground truncate mt-0.5">
                            {ev.location}
                          </div>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
            </DialogTitle>
            <DialogDescription>
              Définissez le créneau, le titre et optionnellement le client ou le
              lieu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ag-title">Titre</Label>
              <Input
                id="ag-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Visite chantier"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ag-start">Début</Label>
                <Input
                  id="ag-start"
                  type="datetime-local"
                  value={startLocal}
                  onChange={(e) => setStartLocal(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ag-end">Fin</Label>
                <Input
                  id="ag-end"
                  type="datetime-local"
                  value={endLocal}
                  onChange={(e) => setEndLocal(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Client (optionnel)</Label>
              <Select
                value={clientId || "__none__"}
                onValueChange={(v) =>
                  setClientId(v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Aucun</SelectItem>
                  {clientOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ag-loc">Lieu / chantier</Label>
              <Input
                id="ag-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Optionnel"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ag-notes">Notes</Label>
              <Textarea
                id="ag-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optionnel"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {editing ? (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={() => setDeleteOpen(true)}
                disabled={pending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={pending}>
              <Save className="h-4 w-4 mr-1" />
              {pending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce rendez-vous ?</DialogTitle>
            <DialogDescription>
              Cette action est définitive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={pending}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
