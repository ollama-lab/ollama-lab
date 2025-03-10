import { Component } from "solid-js";
import { AgentList } from "~/lib/components/agent-list";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import { H2hPanel } from "~/lib/components/h2h-panel";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

const H2hPage: Component = () => {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} collapsible>
        <Resizable orientation="vertical">
          <ResizablePanel initialSize={0.75} collapsible>
            <SessionList isH2h />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel initialSize={0.25} collapsible>
            <AgentList />
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75}>
        <H2hPanel />
      </ResizablePanel>
    </Resizable>
  );
};

export default H2hPage;
