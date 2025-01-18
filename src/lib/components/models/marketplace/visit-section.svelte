<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { BASE_DOMAIN, BASE_URL } from "$lib/stores/model-search"
  import { openUrl } from "@tauri-apps/plugin-opener"
  import { fly } from "svelte/transition"

  let { keyword }: { keyword: string } = $props()
</script>

<div class="flex gap-2">
  <Button
    size="sm"
    variant="outline"
    class="z-[1]"
    onclick={async () => {
      await openUrl(BASE_URL)
    }}
  >
    Visit {BASE_DOMAIN}
  </Button>

  {#if keyword.length > 0}
    <div transition:fly={{ x: -100, y: 0, duration: 300 }}>
      <Button
        variant="link"
        size="sm"
        onclick={async () => {
          await openUrl(`${BASE_URL}/search?` + new URLSearchParams({ q: keyword }))
        }}
      >
        Go to {BASE_DOMAIN} with "{keyword}"
      </Button>
    </div>
  {/if}
</div>
