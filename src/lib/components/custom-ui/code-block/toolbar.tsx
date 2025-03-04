import { CopyIcon } from "lucide-solid";
import { Accessor, ComponentProps, splitProps } from "solid-js";
import { toast } from "solid-sonner";
import { cn } from "~/lib/utils/class-names";

type ToolbarButtonProps = ComponentProps<"button">;

function ToolbarButton(props: ToolbarButtonProps) {
  const [local, other] = splitProps(props, ["class", "children"]);

  return (
    <button
      class={cn(
        "cursor-pointer inline-flex gap-2 items-center text-sm bg-accent text-accent-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 px-1 py-0.5 rounded",
        local.class,
      )}
      {...other}
    >
      {props.children}
    </button>
  );
}

export interface CodeBlockToolbarProps {
  code: Accessor<string>;
}

export function CodeBlockToolbar(props: CodeBlockToolbarProps) {
  return (
    <div class="sticky -top-5 z-10">
      <div class="absolute top-0 right-0 flex gap-0.5 px-3 py-0.5 bg-secondary rounded">
        <ToolbarButton
          title="Copy to clipboard"
          onClick={() => {
            window.navigator.clipboard.writeText(props.code());
            toast.success("Successfully copied.");
          }}
        >
          <CopyIcon class="size-4" />
          Copy
        </ToolbarButton>
      </div>
    </div>
  );
}
