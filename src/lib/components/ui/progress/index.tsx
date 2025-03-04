import type { ComponentProps } from "solid-js";
import { createMemo, splitProps } from "solid-js";

import { cn } from "~/lib/utils/class-names";

export interface ProgressProps extends ComponentProps<"div"> {
  value?: number | null;
  minValue?: number;
  maxValue?: number;
}

export function Progress(props: ProgressProps) {
  const [local, other] = splitProps(props, ["class", "value", "minValue", "maxValue"]);
  
  const percentage = createMemo(() => {
    if (props.value === null) {
      return undefined;
    }

    const maxValue = props.maxValue === undefined ? 100 : props.maxValue;
    const minValue = props.minValue ?? 0;
    const value = Math.min(Math.max(props.value ?? 0, minValue), maxValue);

    return (value - minValue) / (maxValue - minValue);
  });

  const transformStyle = createMemo(() => {
    const p = percentage();
    return typeof p === "number" ? `${p * 100 - 100}%` : undefined;
  });

  return (
    <div
      class={cn(
        "relative h-2 overflow-hidden rounded-full bg-secondary",
        local.class,
      )}
      {...other}
    >
      <div
        class={cn(
          "h-full transition-transform bg-primary rounded-full",
          local.value === null && "animate-indeterminate",
        )}
        style={{
          translate: transformStyle(),
        }}
      />
    </div>
  );
}
