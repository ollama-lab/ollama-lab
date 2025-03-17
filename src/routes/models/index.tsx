import { createSignal, onCleanup, onMount } from "solid-js";
import { ModelDetails } from "~/lib/components/model-page/model-details";
import { ModelList } from "~/lib/components/model-page/model-list";
import { Resizable, ResizableHandle, ResizablePanel } from "~/lib/components/ui/resizable";
import { reloadActiveModels } from "~/lib/contexts/globals/model-states";

export default function ModelsPage() {
  const [timerId, setTimerId] = createSignal<number>();

  onMount(() => {
    reloadActiveModels();

    setTimerId(
      setInterval(() => {
        reloadActiveModels();
      }, 10_000),
    );
  });

  onCleanup(() => {
    clearInterval(timerId());
  });

  return (
    <Resizable orientation="horizontal">
      <ResizablePanel initialSize={0.25} class="overflow-hidden">
        <ModelList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75} class="overflow-hidden">
        <ModelDetails />
      </ResizablePanel>
    </Resizable>
  );
}
