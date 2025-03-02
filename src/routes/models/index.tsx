import { createSignal, onCleanup, onMount } from "solid-js";
import { ModelList } from "~/lib/components/model-page/model-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";
import { useModelContext } from "~/lib/contexts/model-list";

export default function ModelsPage() {
  const modelContext = useModelContext();

  let [timerId, setTimerId] = createSignal<number>();

  onMount(() => {
    if (modelContext) {
      modelContext.reloadActiveModels();

      setTimerId(setInterval(() => {
        modelContext.reloadActiveModels();
      }, 10_000));
    }
  });

  onCleanup(() => {
    clearInterval(timerId());
  });

  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25}>
        <ModelList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
      </ResizablePanel>
    </Resizable>
  );
}
