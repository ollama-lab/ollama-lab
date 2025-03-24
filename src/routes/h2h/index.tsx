import { Component, onMount } from "solid-js";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import H2hPanel from "~/lib/components/h2h-panel";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";
import { reloadSessionSystemPrompt } from "~/lib/contexts/globals/candidate-session-system-prompt";
import { SessionModeProvider } from "~/lib/contexts/session-mode";

const HeadToHeadPage: Component = () => {
  onMount(() => {
    reloadSessionSystemPrompt("h2h");
  });

  return (
    <SessionModeProvider value="h2h">
      <Resizable orientation="horizontal">
        <ResizablePanel initialSize={0.25} class="overflow-hidden">
          <SessionList title="Sessions" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel initialSize={0.75} class="overflow-hidden">
          <H2hPanel />
        </ResizablePanel>
      </Resizable>
    </SessionModeProvider>
  );
};

export default HeadToHeadPage;
