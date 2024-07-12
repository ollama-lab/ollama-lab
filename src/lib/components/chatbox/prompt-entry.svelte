<script lang="ts">
    import { IconArrowUp } from "@tabler/icons-svelte";

    let prompt: string = ""

    $: rows = Math.min(prompt.split("\n").length, 10)

    let form: HTMLFormElement
</script>

<form
  bind:this={form}
  class="flex flex-row bg-surface-200 dark:bg-surface-700 rounded-3xl pl-6 pr-2 py-2 gap-4 place-items-stretch"
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
      name="prompt"
      class="textarea border-none ring-0 !bg-transparent outline-none w-full resize-none"
      {rows}
      bind:value={prompt}
      placeholder="Enter prompt here"
      required
      on:keypress={ev => {
        if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
          ev.preventDefault()
          form.requestSubmit()
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
