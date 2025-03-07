import { A } from "@solidjs/router";
import { Component, createMemo, JSX } from "solid-js";
import { cn } from "~/lib/utils/class-names";

export const TabLink: Component<{
  children?: JSX.Element;
  name: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}> = (props) => {
  const active = createMemo(() => props.active);
  const href = () => props.href;
  const name = createMemo(() => props.name);

  return (
    <div class={cn("group flex rounded cursor-pointer", active() && "bg-secondary")} onClick={() => props.onClick?.()}>
      <div class="py-1">
        <hr
          class={cn(
            "border h-full border-transparent rounded-full",
            active() ? "border-primary" : "group-hover:border-secondary",
          )}
        />
      </div>

      <A href={href() ?? ""} aria-label={name()} title={name()} draggable={false} class="p-3">
        {props.children}
      </A>
    </div>
  );
}
