<script lang="ts">
  import { IconSelector } from "@tabler/icons-svelte";

  export let model: string

  export let variant: string

</script>

<div class="flex place-items-center">
  <span class="font-bold">{model}:{variant}</span>
  <button
    class="btn-icon btn-icon-sm"
  >
    <IconSelector />
  </button>
</div>
