import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";

export default function H2hPage() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} collapsible>
        <Resizable orientation="vertical">
          <ResizablePanel initialSize={0.75} collapsible>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel initialSize={0.25} collapsible>
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75}>
      </ResizablePanel>
    </Resizable>
  );
}
