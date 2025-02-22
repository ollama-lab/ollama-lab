<script lang="ts">
  import { getCompressedImageBase64 } from "$lib/commands/image"
  import Loading from "$lib/components/custom-ui/loading.svelte"

  let { paths }: {
    paths: string[]
  } = $props()

  let images = $derived(Promise.all(paths.map((path) => getCompressedImageBase64(path))))
</script>

<div class="flex gap-2 overflow-x-auto">
  {#await images}
    <Loading />
  {:then images}
    {#each images as image}
      <div>
        <img src={`data:${image.mime};base64,${image.base64}`} alt={image.path}>
      </div>
    {/each}
  {/await}
</div>
