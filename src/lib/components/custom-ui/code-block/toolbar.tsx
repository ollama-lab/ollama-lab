import { ChevronUpIcon, CopyIcon, WrapTextIcon } from "lucide-solid";
import { Accessor, ComponentProps, JSX, Show, splitProps } from "solid-js";
import { toast } from "solid-sonner";
import { cn } from "~/lib/utils/class-names";

interface ToolbarButtonProps extends ComponentProps<"button"> {
  icon?: JSX.Element;
  text?: string;
  enabled?: boolean;
}

function ToolbarButton(props: ToolbarButtonProps) {
  const [local, other] = splitProps(props, ["class", "children", "icon", "text", "enabled"]);

  return (
    <button
      class={cn(
        "cursor-pointer inline-flex gap-1.5 items-center text-sm bg-accent text-accent-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 px-1 py-0.5 rounded transition-colors",
        local.enabled && "bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800",
        local.class,
      )}
      {...other}
    >
      {local.icon}
      <Show when={local.text}>
        {(t) => (
          <span class="hidden md:inline">{t()}</span>
        )}
      </Show>
      {props.children}
    </button>
  );
}

export interface CodeBlockToolbarProps {
  code: Accessor<string>;
  class?: string;
  wrapText?: Accessor<boolean>;
  onToggleWrapText?: () => void;
  collapsible?: boolean;
  collapsed?: Accessor<boolean>;
  onToggleCollapsed?: () => void;
}

export function CodeBlockToolbar(props: CodeBlockToolbarProps) {
  return (
    <div class={cn("flex gap-0.5 bg-secondary rounded", props.class)}>
      <ToolbarButton
        icon={<WrapTextIcon class="size-4" />}
        text="Wrap"
        title="Wrap text"
        onClick={() => props.onToggleWrapText?.()}
        enabled={props.wrapText?.()}
      />
      <ToolbarButton
        icon={<CopyIcon class="size-4" />}
        text="Copy"
        title="Copy to clipboard"
        onClick={() => {
          window.navigator.clipboard.writeText(props.code());
          toast.success("Successfully copied.");
        }}
      />
      <Show when={props.collapsible}>
        <ToolbarButton
          icon={<ChevronUpIcon class={cn("size-4 transition-transform", props.collapsed?.() && "-rotate-180")} />}
          title="Collapse"
          onClick={() => props.onToggleCollapsed?.()}
        />
      </Show>
    </div>
  );
}
