import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ChatFeeds } from "../chat-sessions/chat-panel/chat-feeds";
import { PromptInput } from "../chat-sessions/prompt-input";
import SessionAgents from "./session-agents";
import { selectedSessionAgent } from "~/lib/contexts/globals/session-agent";
import { AgentDetails } from "./session-agents/details";
import { Presence } from "solid-motionone";
import { currentSession } from "~/lib/contexts/globals/current-session";
import { cn } from "~/lib/utils/class-names";
import SessionSettings from "./session-settings";
import { useSessionMode } from "~/lib/contexts/session-mode";

const [tabValue, setTabValue] = createSignal("chats");

const H2hPanel: Component = () => {
  const mode = useSessionMode();

  const currentH2hSession = createMemo(() => currentSession(mode()));

  createEffect(() => {
    if (!currentH2hSession() && tabValue() === "chats") {
      setTabValue("agents");
    }
  });

  const chatsAllowed = createMemo(() => !!currentH2hSession());

  return (
    <Tabs class="px-2 pt-2 h-full flex flex-col" value={tabValue()} onChange={setTabValue}>
      <TabsList class={cn(
        "grid w-full",
        chatsAllowed() ? "grid-cols-3" : "grid-cols-2",
      )}>
        <Show when={chatsAllowed()}>
          <TabsTrigger value="chats">Chat</TabsTrigger>
        </Show>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="session">Session</TabsTrigger>
      </TabsList>
      <Show when={chatsAllowed()}>
        <TabsContent value="chats" class="flex flex-col grow overflow-y-clip">
          <div class="grow px-4 py-2 w-full overflow-y-auto">
            <ChatFeeds />
          </div>

          <div class="max-w-5xl w-full mx-auto">
            <PromptInput />
          </div>
        </TabsContent>
      </Show>
      <TabsContent value="agents" class="flex flex-col grow">
        <Presence exitBeforeEnter>
          <Show when={selectedSessionAgent()} fallback={<SessionAgents />}>
            {(agentId) => (
              <AgentDetails agentId={agentId()} />
            )}
          </Show>
        </Presence>
      </TabsContent>
      <TabsContent value="session" class="flex flex-col grow">
        <SessionSettings />
      </TabsContent>
    </Tabs>
  );
};

export default H2hPanel;
