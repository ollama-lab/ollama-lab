import { AgentList } from "~/lib/components/agent-list";
import { ChatPanel } from "~/lib/components/chat-sessions/chat-panel";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

export default function IndexPage() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} collapsible>
        <Resizable orientation="vertical">
          <ResizablePanel initialSize={0.75} collapsible>
            <SessionList />
          </ResizablePanel>
          <ResizablePanel initialSize={0.25} collapsible>
            <AgentList />
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75}>
        <ChatPanel />
      </ResizablePanel>
    </Resizable>
  );
}
