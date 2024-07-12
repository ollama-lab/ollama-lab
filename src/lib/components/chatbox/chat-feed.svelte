<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
    import ModelSelector from "../model-selector.svelte";
    import PromptEntry from "./prompt-entry.svelte";
    import Welcome from "./chat-feed/welcome.svelte";
    import BubbleList from "./bubble-list.svelte";
    import type { Feed } from "$lib/models/feed";

  export let activeSession: number | null

  let feeds: Feed[] = [
    {
      sender: "user",
      content: "What is the biggest building in the world?",
      date: new Date("5/12/2024 15:51:22"),
      isEdited: false,
    },
    {
      status: "completed",
      sender: "assistant",
      content: "The biggest building in the world by height is...",
      model: {
        model: "llama3",
        variant: "7B",
      },
      date: new Date("5/12/2024 15:52:10"),
    },
    {
      sender: "user",
      content: "What is the biggest building in the world?",
      date: new Date("5/12/2024 15:51:22"),
      isEdited: true,
    },
    {
      status: "completed",
      sender: "assistant",
      content: "The biggest building in the world by height is...",
      model: {
        model: "llama3",
        variant: "7B",
      },
      date: new Date("5/12/2024 15:52:10"),
    },
  ]

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
      <BubbleList {feeds} />
    {/if}
  </div>
  <div class="px-4 py-2">
    <PromptEntry />
  </div>
</div>
