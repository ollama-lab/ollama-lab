<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton"
  import ModelSelector from "../model-selector.svelte"
  import PromptEntry from "./prompt-entry.svelte"
  import Welcome from "./chat-feed/welcome.svelte"
  import BubbleList from "./bubble-list.svelte"
  import { currentSession, sessionList } from "$lib/stores/sessions"

  let currentModel: string | undefined = $sessionList.find(s => s.id === $currentSession)?.currentModel
</script>

<div class="w-full h-dvh flex flex-col">
  <AppBar class="shadow-sm z-[1]">
    <ModelSelector bind:currentModel />
  </AppBar>
  <div class="flex-auto overflow-y-scroll">
    {#if $currentSession === null}
      <Welcome />
    {:else}
      <BubbleList />
    {/if}
  </div>
  <div class="px-4 py-2 z-[1] shadow-sm">
    <PromptEntry />
  </div>
</div>
