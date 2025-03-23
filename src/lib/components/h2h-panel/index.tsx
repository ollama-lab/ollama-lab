import { Component, createSignal } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ChatFeeds } from "../chat-sessions/chat-panel/chat-feeds";
import { PromptInput } from "../chat-sessions/prompt-input";
import SessionAgents from "./session-agents";

const [tabValue, setTabValue] = createSignal("chats");

const H2hPanel: Component = () => {
  return (
    <Tabs class="px-2 py-2 h-full flex flex-col" value={tabValue()} onChange={setTabValue}>
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="chats">Chats</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
      </TabsList>

      <TabsContent value="chats" class="flex flex-col grow">
        <div class="grow px-4 py-2 w-full overflow-y-auto">
          <ChatFeeds mode="h2h" />
        </div>

        <div class="max-w-5xl w-full mx-auto -mb-2">
          <PromptInput mode="h2h" />
        </div>
      </TabsContent>
      <TabsContent value="agents" class="flex flex-col grow">
        <SessionAgents />
      </TabsContent>
    </Tabs>
  );
};

export default H2hPanel;
