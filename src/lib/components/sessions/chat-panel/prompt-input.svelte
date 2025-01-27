<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import autosize from "autosize"
  import { ArrowUpIcon, Loader2Icon } from "lucide-svelte"
  import { selectedSessionModel } from "$lib/stores/models"
  import { toast } from "svelte-sonner"
  import { chatHistory } from "$lib/stores/chats"
  import type { IncomingUserPrompt } from "$lib/models/chat"

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
  class="bg-secondary text-secondary-foreground flex flex-col gap-2 px-3 py-3 mb-4 rounded-3xl"
  onsubmit={(ev) => {
    ev.preventDefault()

    if (status || !$selectedSessionModel || prompt.length < 1) {
      return
    }

    status = "submitting"

    const promptObject: IncomingUserPrompt = {
      text: prompt.trim(),
    }

    chatHistory.submit(promptObject, {
      onRespond: () => status = "responding",
    }).finally(() => status = undefined)
  }}
>
    <textarea
      bind:this={textEntry}
      name="prompt"
      bind:value={prompt}
      class="w-full border-none outline-none resize-none bg-transparent max-h-72 mx-2 mt-1"
      placeholder="Enter your prompt here"
      required
      onkeypress={(ev) => {
        if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
          ev.preventDefault()
          form?.submit()
        }
      }}
    ></textarea>

  <div class="flex">
    <div class="flex-grow flex">
    </div>

    <div class="flex-shrink-0">
      <Button
        size="icon"
        class="rounded-full"
        type="submit"
        disabled={!!status || prompt.length < 1 || !$selectedSessionModel}
      >
        {#if status === "submitting"}
          <Loader2Icon class="!size-6 animate-spin" />
        {:else}
          <ArrowUpIcon class="!size-6" />
        {/if}
      </Button>
    </div>
  </div>
</form>
