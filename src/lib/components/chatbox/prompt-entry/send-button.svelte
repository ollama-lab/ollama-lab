<script lang="ts">
  import { IconArrowUp, IconLoader2, IconLoader3 } from "@tabler/icons-svelte"
  import type { PromptSubmissionStatus } from "$lib/models/prompts"

  export let status: PromptSubmissionStatus = "submittable"
</script>

<button
  type="submit"
  class="btn-icon variant-filled btn-icon-sm"
  title={status === "submitting" || status === "responding" ? "Please wait..." : "Send"}
  disabled={status !== "submittable"}
>
  {#if status === "submitting"}
    <IconLoader2 class="animate-spin" />
  {:else if status === "responding"}
    <IconLoader3 class="animate-spin" />
  {:else}
    <IconArrowUp />
  {/if}
</button>
