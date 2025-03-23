import { Component, createMemo, createResource, createSignal, For } from "solid-js";
import { addSessionAgent, listAllAgents } from "~/lib/commands/agents";
import { currentSession, setCurrentSessionId } from "~/lib/contexts/globals/current-session";
import { SessionAgentsItem } from "./item";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-solid";
import AgentCreationCommand from "../agent-creation-command";
import { createSession } from "~/lib/commands/sessions";
import { getCurrentModel } from "~/lib/contexts/globals/current-model";
import { reloadSession } from "~/lib/contexts/globals/sessions";

const SessionAgents: Component = () => {
  const sessionId = createMemo(() => currentSession("h2h")?.id);

  const [items, { refetch }] = createResource(sessionId, async (id) => {
    return await listAllAgents(id); 
  });

  const [cmdOpen, setCmdOpen] = createSignal(false);

  const createAgent = async (id: number) => {
    let sessionId2 = sessionId();
    if (sessionId2 === undefined) {
      const newSession = await createSession(getCurrentModel("h2h") ?? "", undefined, "h2h");
      sessionId2 = newSession.id;

      reloadSession(sessionId2, "h2h");
      setCurrentSessionId(sessionId2, "h2h");
    }

    await addSessionAgent(id, sessionId2);
    await refetch();
  };

  return (
    <div
      class="flex flex-col gap-2"
      onDrop={(ev) => {
        ev.preventDefault();

        const movedItem = ev.dataTransfer?.getData("text/plain");
        if (movedItem) {
          // TODO: Add reordering
        }
      }}
      onDragOver={(ev) => {
        ev.preventDefault();
        if (ev.dataTransfer) {
          ev.dataTransfer.dropEffect = "move";
        }
      }}
    >
      <For each={items()}>
        {(item) => (
          <SessionAgentsItem item={item} />
        )}
      </For>

      <Button
        variant="outline"
        title="Add agent"
        onClick={() => setCmdOpen(true)}
      >
        <PlusIcon />
      </Button>

      <AgentCreationCommand
        open={cmdOpen()}
        onOpenChange={setCmdOpen}
        onSelected={createAgent}
      />
    </div>
  );
};

export default SessionAgents;
