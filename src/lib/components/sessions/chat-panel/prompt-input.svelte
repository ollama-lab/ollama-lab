<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import autosize from "autosize"
  import { ArrowUpIcon, ChevronDownIcon, Loader2Icon } from "lucide-svelte"
  import { selectedSessionModel, usingSystemPrompt } from "$lib/stores/models"
  import { chatHistory } from "$lib/stores/chats"
  import type { IncomingUserPrompt } from "$lib/models/chat"
  import { emit } from "@tauri-apps/api/event"
  import { cn } from "$lib/utils"
  import { hidePromptBar } from "$lib/stores/prompt-input"
  import { get } from "svelte/store"

  let form = $state<HTMLFormElement | undefined>()
  let textEntry = $state<HTMLTextAreaElement | undefined>()
  let autosizeAttached = false

  function attachAutosize() {
    if (textEntry && !autosizeAttached) {
      autosize(textEntry)
      autosizeAttached = true
    }
  }

  let prompt = $state("")

  let status = $state<"submitting" | "responding" | undefined>()

  $effect(() => {
    const el = textEntry
    el?.addEventListener("focus", attachAutosize)

    return () => {
      if (el) {
        el.removeEventListener("focus", attachAutosize)
        autosize.destroy(el)
        autosizeAttached = false
      }
    }
  })
</script>

<form
  bind:this={form}
  class={cn(
    "border border-secondary text-secondary-foreground bg-background flex flex-col gap-2 px-3 pt-0 pb-3 rounded-t-3xl overflow-hidden",
    "transition-[margin]",
  )}
  style={`margin-bottom: -${$hidePromptBar ? (form?.clientHeight ?? 0) - 16 : 0}px`}
  onsubmit={(ev) => {
    ev.preventDefault()

    if (status || !$selectedSessionModel || prompt.length < 1) {
      return
    }

    status = "submitting"

    const promptObject: IncomingUserPrompt = {
      text: prompt.trim(),
      useSystemPrompt: get(usingSystemPrompt),
    }

    chatHistory.submit(promptObject, {
      onRespond: () => {
        status = "responding"
        prompt = ""
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

  <textarea
    bind:this={textEntry}
    name="prompt"
    bind:value={prompt}
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
