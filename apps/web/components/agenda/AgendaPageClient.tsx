"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mic,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createAgendaEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
} from "@/app/actions/agenda";
import { addUtcDays, AGENDA_VISIBLE_WEEK_COUNT } from "@/lib/agenda/week";
import {
  chipStyleForEvent,
  EVENT_KIND_LABELS,
  TYPOLOGY_LABELS,
} from "@/lib/agenda/event-meta";
import {
  isSpeechRecognitionSupported,
  startFrenchDictation,
} from "@/lib/agenda/speech";
import type {
  AgendaEventKind,
  AgendaTypology,
} from "@/lib/drizzle/schema";
import { AGENDA_TYPOLOGIES } from "@/lib/drizzle/schema";

export type AgendaEventSerializable = {
  id: string;
  userId: string;
  clientId: string | null;
  eventKind: AgendaEventKind;
  typology: AgendaTypology;
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

const WEEKDAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

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

function shortReminderEnd(startLocal: string): string {
  const d = new Date(startLocal);
  if (Number.isNaN(d.getTime())) return "";
  const e = new Date(d);
  e.setMinutes(e.getMinutes() + 15);
  return toDatetimeLocalValue(e);
}

function formatTimeRangeFr(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };
  return `${start.toLocaleTimeString("fr-FR", opts)} – ${end.toLocaleTimeString("fr-FR", opts)} (UTC)`;
}

function formatTimeUtc(d: Date): string {
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function formatDayHeaderUtc(day: Date): string {
  return day.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function formatShortYmdUtc(d: Date): string {
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function DictationMicButton({
  appendText,
  disabled,
  label,
}: {
  appendText: (text: string) => void;
  disabled?: boolean;
  label: string;
}): ReactElement | null {
  const [listening, setListening] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      abortRef.current?.();
    };
  }, []);

  function handleClick(): void {
    if (listening) {
      abortRef.current?.();
      abortRef.current = null;
      setListening(false);
      return;
    }

    const handle = startFrenchDictation({
      onResult: (t) => {
        appendText(t);
      },
      onError: (m) => toast.error(m),
      onEnd: () => {
        setListening(false);
        abortRef.current = null;
      },
    });

    if (!handle) {
      return;
    }

    abortRef.current = handle.abort;
    setListening(true);
  }

  if (!supported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="shrink-0"
      disabled={disabled}
      onClick={handleClick}
      title={label}
      aria-label={label}
    >
      <Mic className={`h-4 w-4 ${listening ? "text-rose-500 animate-pulse" : ""}`} />
    </Button>
  );
}

function AgendaEventChip({
  ev,
  onOpenDetail,
}: {
  ev: AgendaEventSerializable;
  onOpenDetail: () => void;
}): ReactElement {
  const s = new Date(ev.startAt);
  const e = new Date(ev.endAt);
  const chipClass = chipStyleForEvent(ev.eventKind, ev.typology);
  const Icon = ev.eventKind === "reminder" ? Bell : Calendar;

  const tooltipLines = [
    `${EVENT_KIND_LABELS[ev.eventKind]} · ${ev.eventKind === "appointment" ? TYPOLOGY_LABELS[ev.typology] : "—"}`,
    ev.title,
    formatTimeRangeFr(s, e),
    ev.clientName ? `Client : ${ev.clientName}` : null,
    ev.location ? `Lieu : ${ev.location}` : null,
    ev.notes?.trim() ? `Notes : ${ev.notes.trim()}` : null,
  ].filter(Boolean) as string[];

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail();
          }}
          className={`w-full text-left rounded-md px-1.5 py-1 text-[10px] sm:text-xs leading-tight transition-colors ${chipClass}`}
        >
          <div className="flex items-start gap-1">
            <Icon
              className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 mt-0.5 opacity-90"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold line-clamp-2 break-words">
                {ev.title}
              </div>
              <div className="tabular-nums opacity-90 mt-0.5">
                {formatTimeUtc(s)} – {formatTimeUtc(e)}
              </div>
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="start"
        className="max-w-xs text-xs text-pretty"
      >
        <div className="space-y-1.5">
          {tooltipLines.map((line, i) => (
            <p key={i} className={i === 0 ? "font-semibold" : ""}>
              {line}
            </p>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 border-t pt-2">
          Clic pour modifier
        </p>
      </TooltipContent>
    </Tooltip>
  );
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
    const n = 7 * AGENDA_VISIBLE_WEEK_COUNT;
    const days: Date[] = [];
    for (let i = 0; i < n; i += 1) {
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

  const [eventKind, setEventKind] = useState<AgendaEventKind>("appointment");
  const [typology, setTypology] = useState<AgendaTypology>("other");
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
    setEventKind("appointment");
    setTypology("other");
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
    setEventKind(ev.eventKind);
    setTypology(ev.typology);
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

      const payload = {
        eventKind,
        typology: eventKind === "reminder" ? ("other" as const) : typology,
        title,
        notes: notes || undefined,
        location: location || undefined,
        clientId: clientId || undefined,
        startAt: startIso,
        endAt: endIso,
      };

      if (editing) {
        const result = await updateAgendaEvent({
          id: editing.id,
          ...payload,
        });
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Événement enregistré");
      } else {
        const result = await createAgendaEvent(payload);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Événement créé");
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
      toast.success("Événement supprimé");
      setDeleteOpen(false);
      setDialogOpen(false);
      router.refresh();
    });
  }

  const dialogTitle =
    editing?.eventKind === "reminder" || (!editing && eventKind === "reminder")
      ? editing
        ? "Modifier le rappel"
        : "Nouveau rappel"
      : editing
        ? "Modifier le rendez-vous"
        : "Nouveau rendez-vous";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Grille en tuiles : {AGENDA_VISIBLE_WEEK_COUNT} semaines (lun. → dim.),
            fuseau UTC. Couleurs par type de rendez-vous ; les rappels ont une
            présentation dédiée. Dictée disponible via le micro (navigateurs
            compatibles).
          </p>
        </div>
        <Button type="button" onClick={openCreate} disabled={pending}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/agenda?week=${prevWeekYmd}`} aria-label="Semaine précédente">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm font-medium tabular-nums min-w-[12rem] text-center sm:min-w-[20rem]">
            {formatShortYmdUtc(mondayUtc)}
            {" → "}
            {formatShortYmdUtc(
              addUtcDays(mondayUtc, 7 * AGENDA_VISIBLE_WEEK_COUNT - 1)
            )}
          </span>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/agenda?week=${nextWeekYmd}`} aria-label="Semaine suivante">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/agenda">Aujourd’hui</Link>
          </Button>
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> Rendez-vous
        </span>
        <span className="inline-flex items-center gap-1">
          <Bell className="h-3.5 w-3.5 text-rose-600" /> Rappel
        </span>
        {AGENDA_TYPOLOGIES.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full shrink-0 ${
                t === "site_visit"
                  ? "bg-amber-500"
                  : t === "quote"
                    ? "bg-sky-500"
                    : t === "work"
                      ? "bg-emerald-500"
                      : t === "admin"
                        ? "bg-slate-500"
                        : "bg-violet-500"
              }`}
            />
            {TYPOLOGY_LABELS[t]}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <div className="min-w-[720px] space-y-3">
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAY_HEADERS.map((h) => (
              <div
                key={h}
                className="text-center text-[11px] sm:text-xs font-semibold text-muted-foreground py-1"
              >
                {h}
              </div>
            ))}
          </div>

          {Array.from({ length: AGENDA_VISIBLE_WEEK_COUNT }, (_, w) => (
            <div key={w} className="grid grid-cols-7 gap-2">
              {weekDays.slice(w * 7, w * 7 + 7).map((day) => {
                const key = day.toISOString().slice(0, 10);
                const dayEvents = byDay.get(key) ?? [];
                return (
                  <div
                    key={key}
                    className="flex flex-col rounded-xl border bg-card shadow-sm aspect-square min-h-[88px] min-w-0 p-2"
                  >
                    <div className="shrink-0 text-center text-[10px] sm:text-[11px] font-semibold leading-tight mb-1.5 pb-1 border-b border-border/80 capitalize">
                      {formatDayHeaderUtc(day)}
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1 pr-0.5">
                      {dayEvents.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center mt-1">
                          —
                        </p>
                      ) : (
                        dayEvents.map((ev) => (
                          <AgendaEventChip
                            key={ev.id}
                            ev={ev}
                            onOpenDetail={() => openEdit(ev)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Créneau, type et titre. Utilisez le micro pour dicter le titre ou
              les notes (Chrome / Edge recommandés).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ag-kind">Nature</Label>
                <Select
                  value={eventKind}
                  onValueChange={(v) => {
                    const k = v as AgendaEventKind;
                    setEventKind(k);
                    if (k === "reminder" && startLocal) {
                      setEndLocal(shortReminderEnd(startLocal));
                    }
                  }}
                >
                  <SelectTrigger id="ag-kind">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">
                      {EVENT_KIND_LABELS.appointment}
                    </SelectItem>
                    <SelectItem value="reminder">
                      {EVENT_KIND_LABELS.reminder}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {eventKind === "appointment" ? (
                <div className="grid gap-2">
                  <Label htmlFor="ag-typology">Typologie</Label>
                  <Select
                    value={typology}
                    onValueChange={(v) => setTypology(v as AgendaTypology)}
                  >
                    <SelectTrigger id="ag-typology">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENDA_TYPOLOGIES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {TYPOLOGY_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground self-end pb-2">
                  Les rappels utilisent le style « rappel » (cloche, couleur
                  dédiée).
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ag-title">Titre</Label>
              <div className="flex gap-2">
                <Input
                  id="ag-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex. Visite chantier chez M. Dupont"
                  className="flex-1"
                />
                <DictationMicButton
                  appendText={(t) =>
                    setTitle((prev) => (prev.trim() ? `${prev.trim()} ${t}` : t))
                  }
                  disabled={pending}
                  label="Dicter le titre"
                />
              </div>
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
              <div className="flex gap-2">
                <Input
                  id="ag-loc"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Optionnel"
                  className="flex-1"
                />
                <DictationMicButton
                  appendText={(t) =>
                    setLocation((prev) =>
                      prev.trim() ? `${prev.trim()} ${t}` : t
                    )
                  }
                  disabled={pending}
                  label="Dicter le lieu"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ag-notes">Notes</Label>
              <div className="flex gap-2 items-start">
                <Textarea
                  id="ag-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optionnel"
                  className="flex-1 min-h-[80px]"
                />
                <DictationMicButton
                  appendText={(t) =>
                    setNotes((prev) => (prev.trim() ? `${prev.trim()} ${t}` : t))
                  }
                  disabled={pending}
                  label="Dicter les notes"
                />
              </div>
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
            <DialogTitle>Supprimer cet événement ?</DialogTitle>
            <DialogDescription>
              Cette action est définitive (rendez-vous ou rappel).
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
