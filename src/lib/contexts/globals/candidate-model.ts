import { createEffect, createSignal } from "solid-js";
import { currentSession } from "./current-session";

const [candidate, setCandidate] = createSignal<string | null>(null);

createEffect(() => {
  const session = currentSession();
  setCandidate(session ? session.currentModel : null);
});

export { candidate, setCandidate };
