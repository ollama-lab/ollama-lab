import { Component } from "solid-js";
import { AgentTemplateDetails } from "~/lib/components/agent-template-details";
import { AgentTemplateList } from "~/lib/components/agent-template-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

const AgentTemplatePage: Component = () => {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} class="overflow-hidden">
        <AgentTemplateList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75} class="overflow-hidden">
        <AgentTemplateDetails />
      </ResizablePanel>
    </Resizable>
  );
}

export default AgentTemplatePage;
