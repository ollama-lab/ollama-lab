<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
    import ModelSelector from "../model-selector.svelte";
    import PromptEntry from "./prompt-entry.svelte";

  export let activeSession: number | null

  let model: string = "llama3"
  let variant: string = "7B"

  const kbdHints: { keys: string[], description: string }[] = [
    {
      keys: ["Enter"],
      description: "Send message",
    },
    {
      keys: ["Shift", "AND", "Enter"],
      description: "Line feed",
    },
  ]
</script>

<div class="size-full flex flex-col gap-1">
  <AppBar>
    <ModelSelector bind:model bind:variant />
  </AppBar>
  <div class="flex-auto overflow-y-scroll">
    {#if activeSession === null}
      <div class="flex-auto flex flex-col place-content-center h-full gap-3">
        <div class="text-center font-bold text-2xl">
          Hello there! 👋
        </div>
        <div class="flex flex-col place-self-center">
          <span class="text-neutral-600 dark:text-neutral-400 text-sm text-center">Key hints</span>
          <table>
            {#each kbdHints as { keys, description }}
              <tr> 
                <td class="text-right pr-4">
                  <span>
                    {#each keys as key}
                      {#if key === "AND"}
                        <span>+</span>
                      {:else if key === "OR"}
                        <span>/</span>
                      {:else}
                        <kbd class="kbd">{key}</kbd>
                      {/if}
                    {/each}
                  </span>
                </td>
                <td>{description}</td>
              </tr>
            {/each}
          </table>
        </div>
      </div>
    {:else}
    {/if}
  </div>
  <div class="px-4 py-2">
    <PromptEntry />
  </div>
</div>
