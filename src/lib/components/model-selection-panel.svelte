<script lang="ts">
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";

  export let activeModel: string

  const models = [
    "llama3:7B",
    "mistral:7B",
    "mixtral:13Bx8",
  ]

</script>

<div class="card overflow-y-scroll max-h-60" data-popup="popupModelSelection">
  <ListBox>
    {#each models as model (model)}
      <ListBoxItem
        value={model}
        name="models"
        bind:group={activeModel}
        active="variant-ghost"
        rounded="rounded-lg"
      >
        {model}
      </ListBoxItem>
    {/each}
  </ListBox>
</div>
