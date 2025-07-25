import { Component, onMount } from "solid-js";
import { ChatPanel } from "~/lib/components/chat-sessions/chat-panel";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";
import { createInitializeCandidate } from "~/lib/contexts/globals/candidate-model";
import { reloadSessionSystemPrompt } from "~/lib/contexts/globals/candidate-session-system-prompt";
import { createReloadChatHistory } from "~/lib/contexts/globals/chat-history";
import { SessionModeProvider } from "~/lib/contexts/session-mode";

const IndexPage: Component = () => {
  onMount(() => {
    reloadSessionSystemPrompt("normal");
  });


  createInitializeCandidate("normal");
  createReloadChatHistory("normal");

  return (
    <SessionModeProvider value="normal">
      <Resizable orientation="horizontal">
        <ResizablePanel initialSize={0.25} collapsible class="overflow-hidden">
          <SessionList title="Sessions" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel initialSize={0.75} class="overflow-hidden">
          <ChatPanel />
        </ResizablePanel>
      </Resizable>
    </SessionModeProvider>
  );
};

export default IndexPage;
