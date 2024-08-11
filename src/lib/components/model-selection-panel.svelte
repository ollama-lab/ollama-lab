<script lang="ts">
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton"
  import { modelList } from "$lib/stores/models"

  export let currentModel: string | undefined
</script>

<div class="card overflow-y-scroll max-h-60" data-popup="popupModelSelection">
  {#if $modelList.length}
    <ListBox>
      {#each $modelList.map(item => item.name) as name (name)}
        <ListBoxItem
          value={name}
          name="models"
          bind:group={currentModel}
          active="variant-ghost"
          rounded="rounded-lg"
        >
          {name}
        </ListBoxItem>
      {/each}
    </ListBox>
  {:else}
    <div class="px-6 py-3">No models installed</div>
  {/if}
</div>
