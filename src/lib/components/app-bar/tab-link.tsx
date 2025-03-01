import { A } from "@solidjs/router";
import { children, createMemo, JSX } from "solid-js";
import { cn } from "~/lib/utils/class-names";

export interface TabLinkProps {
  children?: JSX.Element;
  name: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export function TabLink(props: TabLinkProps) {
  const active = createMemo(() => props.active);
  const href = () => props.href;
  const name = createMemo(() => props.name);
  const childrenComp = children(() => props.children);
  const onClickFn = () => props.onClick;

  return (
    <div
      class={cn(
        "group flex rounded cursor-pointer",
        active() && "bg-secondary",
      )}
      onClick={onClickFn()}
    >
      <div class="py-1">
        <hr
          class={cn(
            "border h-full border-transparent rounded-full",
            active() ? "border-primary" : "group-hover:border-secondary",
          )}
        />
      </div>

      <A
        href={href() ?? ""}
        aria-label={name()}
        title={name()}
        draggable={false}
        class="p-3"
      >
        {childrenComp()}
      </A>
    </div>
  );
}
