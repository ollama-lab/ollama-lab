import { createEffect, createMemo, createSignal } from "solid-js";
import { currentSession } from "./current-session";
import { getSessionSystemPrompt, setSessionSystemPrompt } from "~/lib/commands/system-prompts";

const [candidate, setCandidate] = createSignal<string>();

const sessionId = createMemo(() => currentSession()?.id);

createEffect(() => {
  const id = sessionId();
  if (id !== undefined) {
    getSessionSystemPrompt(id).then((value) => {
      setCandidate(value ?? undefined);
    });
  } else {
    setCandidate(undefined);
  }
});

export function getCandidateSessionSystemPrompt() {
  return candidate();
}

export async function setCandidateSessionSystemPrompt(value?: string, otherId?: number) {
  const id = otherId ?? sessionId();
  if (id !== undefined) {
    await setSessionSystemPrompt(id, value ?? null);
  }

  setCandidate(value);
}
