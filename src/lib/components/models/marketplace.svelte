<script lang="ts" module>
  export interface SearchPreviewItem {
    name: string
    description: string
  }
</script>

<script lang="ts">
  import { BASE_DOMAIN, searchEntrySchema, searchResult } from "$lib/stores/model-search"
  import { SearchIcon } from "lucide-svelte"
  import { PlaceholderTitle } from "."
  import { FormButton, FormControl, FormField } from "../ui/form"
  import { Input } from "../ui/input"
  import { superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import VisitSection from "./marketplace/visit-section.svelte"

  let searchKeyword = $state<string>("")
  let searchPreview = $state<SearchPreviewItem[]>([])

  let searchInfo = $state<typeof searchEntrySchema._type | undefined>($searchResult ? {
    q: $searchResult.keyword,
    c: $searchResult.category,
    o: $searchResult.orderedBy,
  } : undefined)

  const form = superForm(searchEntrySchema.parse({ q: "" }), {
    validators: zodClient(searchEntrySchema),
    onSubmit: ({ cancel }) => {

      cancel()
    },
  })

  const { form: formData, enhance } = form
</script>

<div class="w-full max-w-screen-sm">
  <div class="flex flex-col gap-2">
    <PlaceholderTitle />
    <form
      method="POST"
      class="flex gap-2 w-full"
      use:enhance
    >
      <FormField {form} name="q" class="flex-grow">
        <FormControl>
          {#snippet children({ props })}
            <Input
              {...props}
              bind:value={$formData.q}
              placeholder={`Search on ${BASE_DOMAIN}`}
            />
          {/snippet}
        </FormControl>
      </FormField>

      <FormButton
        size="icon"
        class="flex-shrink-0"
        disabled={$formData.q.length < 1}
      >
        <SearchIcon />
      </FormButton>
    </form>
    <VisitSection keyword={$formData.q} />
  </div>
</div>
