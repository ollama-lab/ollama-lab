import { Component } from "solid-js";
import { SessionList } from "~/lib/components/chat-sessions/session-list";
import H2hPanel from "~/lib/components/h2h-panel";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

const HeadToHeadPage: Component = () => {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} class="overflow-hidden">
        <SessionList
          title="Sessions"
          mode="h2h"
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75} class="overflow-hidden">
        <H2hPanel />
      </ResizablePanel>
    </Resizable>
  );
};

export default HeadToHeadPage;
