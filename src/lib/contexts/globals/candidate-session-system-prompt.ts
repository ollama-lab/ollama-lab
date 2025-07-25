import { createSignal } from "solid-js";
import { currentSession } from "./current-session";
import { getSessionSystemPrompt, setSessionSystemPrompt } from "~/lib/commands/system-prompts";
import { SessionMode } from "~/lib/schemas/session";

const [candidate, setCandidate] = createSignal<string>();

const sessionId = (mode: SessionMode) => currentSession(mode)?.id;

export function reloadSessionSystemPrompt(mode: SessionMode) {
  const id = sessionId(mode);
  if (id !== undefined) {
    getSessionSystemPrompt(id).then((value) => {
      setCandidate(value ?? undefined);
    });
  } else {
    setCandidate(undefined);
  }
}

export function getCandidateSessionSystemPrompt() {
  return candidate();
}

/**
 * @deprecated Use `#applySessionSystemPrompt()` instead
 */
export async function setCandidateSessionSystemPrompt(mode: SessionMode, value?: string, otherId?: number) {
  const id = otherId ?? sessionId(mode);
  if (id !== undefined) {
    await setSessionSystemPrompt(id, value ?? null);
  }

  setCandidate(value);
}

export async function applySessionSystemPrompt(mode: SessionMode, otherId?: number) {
  const id = otherId ?? sessionId(mode);
  const prompt = candidate();

  if (id !== undefined && prompt) {
    await setSessionSystemPrompt(id, prompt);
  }
}
