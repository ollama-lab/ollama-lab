<script lang="ts">
  import { IconArrowUp } from "@tabler/icons-svelte"
  import autosize from "autosize";
  import { onMount } from "svelte";

  let form: HTMLFormElement | undefined
  let textEntry: HTMLTextAreaElement

  let prompt: string = ""

  onMount(() => {
    autosize(textEntry)

    return () => {
      autosize.destroy(textEntry)
    }
  })
</script>

<form
  bind:this={form}
  class="flex flex-row bg-surface-200 dark:bg-surface-700 rounded-[1.4rem] pl-6 pr-2 py-2 gap-4 place-items-stretch"
  on:submit={ev => {
    ev.preventDefault()

    if (!prompt.length) {
      return false
    }
    
    // TODO
  }}
>
  <div class="flex-auto flex place-items-center">
    <textarea
      bind:this={textEntry}
      name="prompt"
      class="textarea border-none ring-0 !bg-transparent outline-none w-full resize-none max-h-32 lg:max-h-52 xl:max-h-72"
      rows={1}
      bind:value={prompt}
      placeholder="Enter prompt here"
      required
      on:keypress={ev => {
        if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
          ev.preventDefault()
          form?.requestSubmit()
        }
      }}
    />
  </div>
  <div class="flex flex-col place-content-end">
    <button
      type="submit"
      class="btn-icon variant-filled btn-icon-sm"
      title="Send prompt"
      disabled={!prompt.length}
    >
      <IconArrowUp />
    </button>
  </div>
</form>
