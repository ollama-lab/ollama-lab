import { SessionList } from "~/lib/components/chat-sessions/session-list";
import { Resizable, ResizablePanel } from "~/lib/components/ui/resizable";

export default function IndexPage() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} collapsible>
        <SessionList />
      </ResizablePanel>
      <ResizablePanel />
      <ResizablePanel></ResizablePanel>
    </Resizable>
  );
}
