import { Component, createMemo, createResource, createSignal, For } from "solid-js";
import { addSessionAgent, listAllAgents } from "~/lib/commands/agents";
import { currentSession, setNewSession } from "~/lib/contexts/globals/current-session";
import { SessionAgentsItem } from "./item";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-solid";
import AgentCreationCommand from "../agent-creation-command";
import { createSession } from "~/lib/commands/sessions";
import { getCurrentModel } from "~/lib/contexts/globals/current-model";
import { reloadSession } from "~/lib/contexts/globals/sessions";
import { Motion } from "solid-motionone";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "../../ui/breadcrumb";
import { useSessionMode } from "~/lib/contexts/session-mode";

const SessionAgents: Component = () => {
  const mode = useSessionMode();

  const sessionId = createMemo(() => currentSession(mode())?.id);

  const [items, { refetch }] = createResource(() => [sessionId()], async ([id]) => {
    if (id === undefined) {
      return undefined;
    }

    return await listAllAgents(id); 
  });

  const [cmdOpen, setCmdOpen] = createSignal(false);

  const createAgent = async (id: number) => {
    let sessionId2 = sessionId();
    if (sessionId2 === undefined) {
      const newSession = await createSession(mode(), getCurrentModel(mode()) ?? "", undefined);
      sessionId2 = newSession.id;

      await reloadSession(sessionId2, mode());
      await setNewSession(sessionId2, mode());
    }

    await addSessionAgent(id, sessionId2);
    await refetch();
  };

  return (
    <Motion.div
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
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.15 }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink current>
              Session agents
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
    </Motion.div>
  );
};

export default SessionAgents;
