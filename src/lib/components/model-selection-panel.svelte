<script lang="ts">
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton"
  import { currentModel, modelList } from "$lib/stores/models"
</script>

<div class="card overflow-y-scroll max-h-60" data-popup="popupModelSelection">
  {#if $modelList.length}
    <ListBox>
      {#each $modelList.map(item => item.name) as name (name)}
        <ListBoxItem
          value={name}
          name="models"
          group={$currentModel?.name}
          active="variant-ghost"
          rounded="rounded-lg"
          on:click={() => $currentModel = $modelList.find(m => m.name === name) ?? null}
        >
          {name}
        </ListBoxItem>
      {/each}
    </ListBox>
  {:else}
    <div class="px-6 py-3">No models installed</div>
  {/if}
</div>
