import { Resizable, ResizablePanel } from "~/lib/components/ui/resizable";

export default function IndexPage() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={.25} collapsible>
      </ResizablePanel>
      <ResizablePanel />
      <ResizablePanel>
      </ResizablePanel>
    </Resizable>
  );
}
