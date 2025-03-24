import { Component, createMemo, createSignal, Show } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ChatFeeds } from "../chat-sessions/chat-panel/chat-feeds";
import { PromptInput } from "../chat-sessions/prompt-input";
import SessionAgents from "./session-agents";
import { selectedSessionAgent } from "~/lib/contexts/globals/session-agent";
import { AgentDetails } from "./session-agents/details";
import { Presence } from "solid-motionone";
import { currentSession } from "~/lib/contexts/globals/current-session";

const [tabValue, setTabValue] = createSignal("chats");

const H2hPanel: Component = () => {
  const derivedTabValue = createMemo(() => currentSession("h2h") ? tabValue() : "agents");

  return (
    <Tabs class="px-2 py-2 h-full flex flex-col" value={derivedTabValue()} onChange={setTabValue}>
        <Show when={currentSession("h2h")}>
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
      </Show>
      <Show when={currentSession("h2h")}>
        <TabsContent value="chats" class="flex flex-col grow">
          <div class="grow px-4 py-2 w-full overflow-y-auto">
            <ChatFeeds mode="h2h" />
          </div>

          <div class="max-w-5xl w-full mx-auto -mb-2">
            <PromptInput mode="h2h" />
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
    </Tabs>
  );
};

export default H2hPanel;
