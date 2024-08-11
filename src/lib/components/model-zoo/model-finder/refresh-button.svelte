<script lang="ts">
  import { IconRefresh } from "@tabler/icons-svelte"
  import { refreshModelList } from "$lib/stores/models"

  let refreshing: boolean = false

  $: style = refreshing ? "animation: spin-counter 1.5s linear infinite;" : ""
</script>

<button
  class="btn-icon btn-icon-sm variant-soft"
  title="Refresh model list"
  on:click={() => {
    refreshing = true
    refreshModelList()
      .finally(() => refreshing = false)
  }}
  disabled={refreshing}
>
  <IconRefresh {style} />
</button>
