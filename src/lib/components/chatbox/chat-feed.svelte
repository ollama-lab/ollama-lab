<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
    import ModelSelector from "../model-selector.svelte";
    import PromptEntry from "./prompt-entry.svelte";
    import Welcome from "./chat-feed/welcome.svelte";

  export let activeSession: number | null

  let model: string = "llama3"
  let variant: string = "7B"

</script>

<div class="size-full flex flex-col gap-1">
  <AppBar>
    <ModelSelector bind:model bind:variant />
  </AppBar>
  <div class="flex-auto overflow-y-scroll">
    {#if activeSession === null}
      <Welcome />
    {:else}
    {/if}
  </div>
  <div class="px-4 py-2">
    <PromptEntry />
  </div>
</div>
