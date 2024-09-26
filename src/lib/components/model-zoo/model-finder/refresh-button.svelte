<script lang="ts">
  import { IconRefresh } from "@tabler/icons-svelte"
  import { refreshModelList } from "$lib/stores/models"
  import { getToastStore } from "@skeletonlabs/skeleton"
  import { twMerge } from "tailwind-merge"

  let refreshing: boolean = false

  const toastStore = getToastStore()
</script>

<button
  class="btn-icon btn-icon-sm variant-soft"
  title="Refresh model list"
  on:click={() => {
    refreshing = true
    refreshModelList()
      .then(() => toastStore.trigger({
        message: "Refresh complete",
        timeout: 5_000,
        background: "variant-ghost",
      }))
      .catch(() => toastStore.trigger({
        message: "Refresh failed",
        background: "variant-ghost-error",
      }))
      .finally(() => refreshing = false)
  }}
  disabled={refreshing}
>
  <IconRefresh
    class={twMerge(
      "-scale-x-100",
      refreshing ? "animate-spin" : "",
    )}
  />
</button>
