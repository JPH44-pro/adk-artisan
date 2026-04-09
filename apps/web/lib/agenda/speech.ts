/**
 * Dictée en français via l’API Web Speech (Chrome, Edge, Safari récents).
 * Typage minimal : les types du DOM pour SpeechRecognition ne sont pas toujours exposés selon la config TS.
 */

type RecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  abort: () => void;
  onresult: ((event: { results: unknown }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionConstructor = new () => RecognitionInstance;

export function getSpeechRecognitionCtor(): RecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export type SpeechDictationHandlers = {
  onResult: (transcript: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
};

/**
 * Démarre une capture unique (phrase). Appeler `abort()` pour arrêter.
 */
export function startFrenchDictation(
  handlers: SpeechDictationHandlers
): { abort: () => void } | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    handlers.onError?.("La dictée vocale n’est pas disponible dans ce navigateur.");
    return null;
  }

  const rec = new Ctor();
  rec.lang = "fr-FR";
  rec.interimResults = false;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  rec.onresult = (event) => {
    const list = event.results as ArrayLike<{ 0?: { transcript?: string } }>;
    const first = list[0]?.[0]?.transcript;
    if (first?.trim()) {
      handlers.onResult(first.trim());
    }
  };

  rec.onerror = (event) => {
    if (event.error === "aborted" || event.error === "no-speech") {
      return;
    }
    const msg =
      event.error === "not-allowed"
        ? "Microphone refusé. Autorisez l’accès dans les paramètres du navigateur."
        : `Erreur dictée : ${event.error}`;
    handlers.onError?.(msg);
  };

  rec.onend = () => {
    handlers.onEnd?.();
  };

  try {
    rec.start();
  } catch {
    handlers.onError?.("Impossible de démarrer la dictée.");
    return null;
  }

  return {
    abort: () => {
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
    },
  };
}
