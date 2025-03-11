import { Component } from "solid-js";
import { AgentList } from "~/lib/components/agent-list";
import { ChatPanel } from "~/lib/components/chat-sessions/chat-panel";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

const IndexPage: Component = () => {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} collapsible class="overflow-hidden">
        <Resizable orientation="vertical">
          <ResizablePanel initialSize={0.75} collapsible class="overflow-hidden">
            <SessionList />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel initialSize={0.25} collapsible class="overflow-hidden">
            <AgentList />
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75} class="overflow-hidden">
        <ChatPanel />
      </ResizablePanel>
    </Resizable>
  );
}

export default IndexPage;
