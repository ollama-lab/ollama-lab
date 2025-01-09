<script lang="ts" module>
  import { z } from "zod"

  export const formSchema = z.object({
    prompt: z.string().trim().min(1),
  })

  export type FormSchema = typeof formSchema
</script>

<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { FormControl, FormField } from "$lib/components/ui/form"
  import autosize from "autosize"
  import { ArrowUpIcon } from "lucide-svelte"
  import { superForm } from "sveltekit-superforms"
  import { zod } from "sveltekit-superforms/adapters"

  let textEntry = $state<HTMLTextAreaElement | undefined>()
  let autosizeAttached = false

  function attachAutosize() {
    if (textEntry && !autosizeAttached) {
      autosize(textEntry)
      autosizeAttached = true
    }
  }

  $effect(() => {
    const el = textEntry
    el?.addEventListener("focus", attachAutosize)

    return () => {
      if (el) {
        el.removeEventListener("focus", attachAutosize)
        autosize.destroy(el)
      }
    }
  })

  const form = superForm({ prompt: "" }, {
    validators: zod(formSchema),
    onSubmit({ validators }) {
    },
  })

  const { form: formData, enhance, submit, isTainted, tainted } = form
</script>

<form
  class="bg-secondary text-secondary-foreground flex flex-col gap-2 px-3 py-3 mb-4 rounded-3xl"
>
  <FormField {form} name="prompt">
    <FormControl>
      {#snippet children({ props })}
        <textarea
          bind:this={textEntry}
          {...props}
          bind:value={$formData.prompt}
          class="w-full border-none outline-none resize-none bg-transparent max-h-72 mx-2 mt-1"
          placeholder="Enter your prompt here"
          required
          onkeypress={(ev) => {
            if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
              ev.preventDefault()
              submit()
            }
          }}
        ></textarea>
      {/snippet}
    </FormControl>
  </FormField>

  <div class="flex">
    <div class="flex-grow flex">
    </div>

    <div class="flex-shrink-0">
      <Button
        size="icon"
        class="rounded-full"
        type="submit"
        disabled={!isTainted($tainted)}
      >
        <ArrowUpIcon class="!size-6" />
      </Button>
    </div>
  </div>
</form>
