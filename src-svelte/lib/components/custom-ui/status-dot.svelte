<script lang="ts" module>
  export type DotStatus = "success" | "warning" | "error" | "disabled"
</script>

<script lang="ts">
  import { cn } from "$lib/utils"
  import { DotIcon } from "lucide-svelte"

  let { status }: { status: DotStatus } = $props()
</script>

<DotIcon
  class={cn(
    "size-10 -m-2",
    status === "success" && "text-green-600",
    status === "warning" && "text-yellow-600",
    status === "error" && "text-red-600",
    status === "disabled" && "text-gray-600",
  )}
/>
