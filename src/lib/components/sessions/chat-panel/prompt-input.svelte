<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import autosize from "autosize"
  import { ArrowUpIcon } from "lucide-svelte"
  import { selectedSessionModel } from "$lib/stores/models"
  import { toast } from "svelte-sonner"

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


  }}
>
    <textarea
      bind:this={textEntry}
      name="prompt"
      bind:value={() => prompt, (value) => prompt = value.trim()}
      class="w-full border-none outline-none resize-none bg-transparent max-h-72 mx-2 mt-1"
      placeholder="Enter your prompt here"
      required
      onkeypress={(ev) => {
        if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
          ev.preventDefault()
          form?.requestSubmit(ev.currentTarget)
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
        disabled={prompt.length < 1 || !$selectedSessionModel}
      >
        <ArrowUpIcon class="!size-6" />
      </Button>
    </div>
  </div>
</form>
