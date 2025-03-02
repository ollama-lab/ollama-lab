import { Show } from "solid-js";
import { cn } from "~/lib/utils/class-names";
import convert from "convert";

export interface ProgressSizeProps {
  completed?: number;
  total?: number;
  class?: string;
}

export default function ProgressSize(props: ProgressSizeProps) {
  const isProgressComplete = () => props.completed !== undefined && props.total !== undefined;
  const completed = () => props.completed;
  const total = () => props.total;

  return (
    <span class={cn(props.class)}>
      <Show when={completed()}>
        {(c) => (
          <span title={`${c().toLocaleString()} bytes`}>
            {convert(c(), "bytes").to("best", "imperial").toString(2)}
          </span>
        )}
      </Show>
      <Show when={isProgressComplete()}>
        /
      </Show>
      <Show when={total()}>
        {(t) => (
          <span title={`${t().toLocaleString()} bytes`}>
            {convert(t(), "bytes").to("best", "imperial").toString(2)}
          </span>
        )}
      </Show>
    </span>
  )
}
