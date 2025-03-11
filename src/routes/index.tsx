import { Component, Match, Switch } from "solid-js";
import { AgentList } from "~/lib/components/agent-list";
import { ChatPanel } from "~/lib/components/chat-sessions/chat-panel";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";
import { getCurrentSettings } from "~/lib/contexts/globals/settings";

const IndexPage: Component = () => {
  const NormalSidebar = () => (
    <SessionList />
  );

  const H2hEnabledSidebar = () => (
    <Resizable orientation="vertical">
      <ResizablePanel initialSize={0.75} collapsible class="overflow-hidden">
        <SessionList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.25} collapsible class="overflow-hidden">
        <AgentList />
      </ResizablePanel>
    </Resizable>
  );

  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} collapsible class="overflow-hidden">
        <Switch fallback={<NormalSidebar />}>
          <Match when={getCurrentSettings().h2h ?? false}>
            <H2hEnabledSidebar />
          </Match>
        </Switch>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75} class="overflow-hidden">
        <ChatPanel />
      </ResizablePanel>
    </Resizable>
  );
}

export default IndexPage;
