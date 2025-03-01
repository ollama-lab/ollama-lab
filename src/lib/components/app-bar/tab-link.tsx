import { A } from "@solidjs/router";
import { JSX } from "solid-js";
import { cn } from "~/lib/utils/class-names";

export interface TabLinkProps {
  children?: JSX.Element;
  name: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export function TabLink({ children, name, href, active, onClick }: TabLinkProps) {
  return (
    <div
      class={cn(
        "group flex rounded cursor-pointer",
        active && "bg-secondary",
      )}
      onClick={onClick}
    >
      <div class="py-1">
        <hr
          class={cn(
            "border h-full border-transparent rounded-full",
            active ? "border-primary" : "group-hover:border-secondary",
          )}
        />
      </div>

      <A
        href={href ?? ""}
        aria-label={name}
        title={name}
        draggable={false}
        class="p-3"
      >
        {children}
      </A>
    </div>
  )
}
