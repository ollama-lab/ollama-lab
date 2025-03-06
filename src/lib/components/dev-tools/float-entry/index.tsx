import { CodeIcon } from "lucide-solid";

export function FloatEntry() {
  return (
    <button class="absolute bottom-0 right-0 z-[500] flex bg-background text-foreground border border-border rounded px-1 py-1 items-center gap-1 hover:bg-secondary">
      <CodeIcon class="size-4" />
      <span class="text-xs">Dev Mode</span>
    </button>
  );
}
