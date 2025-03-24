import { createEffect } from "solid-js";
import { currentSession } from "./current-session";
import { createStore } from "solid-js/store";
import { SessionMode } from "~/lib/models/session";

const [candidate, setCandidate] = createStore<Record<SessionMode, string | null | undefined>>({} as Record<SessionMode, string | null | undefined>);

export function initializeCandidate(mode: SessionMode) {
  const session = currentSession(mode);
  setCandidate(mode, session ? session.currentModel : null);
}

export function getCandidate(mode: SessionMode) {
  return candidate[mode];
}

export function createInitializaCandidate(mode: SessionMode) {
  createEffect(() => {
    initializeCandidate(mode);
  });
}

export { setCandidate };
