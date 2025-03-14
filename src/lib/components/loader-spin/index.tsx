import { Loader2Icon } from "lucide-solid";
import { Component, Show } from "solid-js";
import { cn } from "~/lib/utils/class-names";

export const LoaderSpin: Component<{
  class?: string;
  text?: string;
}> = (props) => {
  const loader = <Loader2Icon class={cn("animate-spin", props.class)} />;

  return (
    <Show when={!!props.text} fallback={loader}>
      <div class={cn("inline-flex flex-row gap-2 items-center", props.class)}>
        {loader}
        <span>{props.text}</span>
      </div>
    </Show>
  );
}
