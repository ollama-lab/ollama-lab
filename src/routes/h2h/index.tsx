import { Component } from "solid-js";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

const HeadToHeadPage: Component = () => {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} class="overflow-hidden">
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75} class="overflow-hidden">
      </ResizablePanel>
    </Resizable>
  );
};

export default HeadToHeadPage;
