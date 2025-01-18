<script lang="ts" module>
  export interface SearchPreviewItem {
    name: string
    description: string
  }
</script>

<script lang="ts">
  import { BASE_DOMAIN, type SearchResult } from "$lib/stores/model-search"
  import { SearchIcon } from "lucide-svelte"
  import { PlaceholderTitle } from "."
  import { FormButton } from "../ui/form"
  import { Input } from "../ui/input"
  import { Button } from "../ui/button"

  //const searchResult: SearchResult = 
</script>

<div class="w-full max-w-screen-sm">
  <div class="flex flex-col gap-2">
    <PlaceholderTitle />
    <form
      class="flex gap-2 w-full"
      onsubmit={() => {
      }}
    >
      <Input
        placeholder={`Search on ${BASE_DOMAIN}`}
      />

      <FormButton
        size="icon"
        class="flex-shrink-0"
      >
        <SearchIcon />
      </FormButton>
    </form>
    <div>
      <Button
        size="sm"
        variant="outline"
      >
        Visit {BASE_DOMAIN}
      </Button>
    </div>
  </div>
</div>
