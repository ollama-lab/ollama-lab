import { createEffect } from "solid-js";
import { currentSession } from "./current-session";
import { createStore } from "solid-js/store";
import { SessionMode } from "~/lib/models/session";

const [candidate, setCandidate] = createStore<Record<SessionMode, string | null | undefined>>({} as Record<SessionMode, string | null | undefined>);

createEffect(() => {
  const session = currentSession("normal");
  setCandidate("normal", session ? session.currentModel : null);
});

createEffect(() => {
  const session = currentSession("h2h");
  setCandidate("h2h", session ? session.currentModel : null);
});

export function getCandidate(mode: SessionMode) {
  return candidate[mode];
}

export { setCandidate };
