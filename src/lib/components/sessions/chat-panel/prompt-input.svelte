<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import autosize from "autosize"
  import { ArrowUpIcon, ChevronDownIcon, Loader2Icon } from "lucide-svelte"
  import { selectedSessionModel } from "$lib/stores/models"
  import { chatHistory } from "$lib/stores/chats"
  import { emit } from "@tauri-apps/api/event"
  import { cn } from "$lib/utils"
  import { hidePromptBar, inputPrompt } from "$lib/stores/prompt-input"
  import { get } from "svelte/store"
  import Toolbar from "./prompt-input/toolbar.svelte"
  import ImagePreview from "./prompt-input/image-preview.svelte"
    import { imageCache } from "$lib/stores/images";

  let form = $state<HTMLFormElement | undefined>()
  let textEntry = $state<HTMLTextAreaElement | undefined>()
  let autosizeAttached = false

  function attachAutosize() {
    if (textEntry && !autosizeAttached) {
      autosize(textEntry)
      autosizeAttached = true
    }
  }

  let status = $state<"submitting" | "responding" | undefined>()

  $effect(() => {
    const el = textEntry
    el?.addEventListener("load", attachAutosize)

    return () => {
      if (el) {
        el.removeEventListener("load", attachAutosize)
        autosize.destroy(el)
        autosizeAttached = false
      }
    }
  })
</script>

<form
  bind:this={form}
  class={cn(
    "border border-secondary text-secondary-foreground bg-background flex flex-col gap-2 px-3 pt-0 pb-2 rounded-t-3xl overflow-hidden",
    "transition-[margin]",
  )}
  style={`margin-bottom: -${$hidePromptBar ? (form?.clientHeight ?? 0) - 16 : 0}px`}
  onsubmit={(ev) => {
    ev.preventDefault()

    if (status || !$selectedSessionModel || prompt.length < 1) {
      return
    }

    status = "submitting"

    chatHistory.submit(get(inputPrompt), {
      onRespond: () => {
        status = "responding"
        inputPrompt.set({ text: "" })
      },
    }).finally(() => status = undefined)
  }}
>
  <Button
    variant="ghost"
    class="h-4 rounded-none -mx-3 my-0"
    onclick={() => {
      hidePromptBar.update(value => !value)
    }}
    title={$hidePromptBar ? "Expand prompt bar" : "Hide prompt bar"}
  >
    <ChevronDownIcon class={cn(
      "size-2 transition",
      $hidePromptBar && "-rotate-180",
    )} />
  </Button>

  {#if $inputPrompt.imagePaths}
    <ImagePreview paths={$inputPrompt.imagePaths} onDelete={(i) => inputPrompt.update(item => {
      const path = item.imagePaths?.splice(i, 1).at(0)
      if (path) {
        imageCache.delete(path)
      }
      return item
    })} />
  {/if}

  <textarea
    bind:this={textEntry}
    name="prompt"
    bind:value={() => $inputPrompt.text, (v) => inputPrompt.update(o => {
      o.text = v
      return o
    })}
    class="w-full border-none outline-none resize-none bg-transparent max-h-72 mx-2"
    placeholder="Enter your prompt here"
    required
    onkeypress={(ev) => {
      if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
        ev.preventDefault()
        form?.requestSubmit()
      }
    }}
  ></textarea>

  <div class="flex">
    <div class="flex-grow flex">
      <Toolbar />
    </div>

    <div class="flex-shrink-0">
      {#if status === "responding" || $chatHistory?.chats.at(-1)?.status === "sending"}
        <Button
          size="icon"
          class="rounded-full"
          type="button"
          title="Stop"
          onclick={async () => {
            await emit("cancel-gen")
          }}
        >
          <img src="/stop-solid.svg" alt="Stop" class="size-5 invert dark:invert-0" />
        </Button>
      {:else}
        <Button
          size="icon"
          class="rounded-full"
          type="submit"
          disabled={!!status || prompt.length < 1 || !$selectedSessionModel}
          title="Send prompt"
        >
          {#if status === "submitting"}
            <Loader2Icon class="!size-6 animate-spin" />
          {:else}
            <ArrowUpIcon class="!size-6" />
          {/if}
        </Button>
      {/if}
    </div>
  </div>
</form>
