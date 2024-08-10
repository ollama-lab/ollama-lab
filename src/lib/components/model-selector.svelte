<script lang="ts">
  import { IconSelector } from "@tabler/icons-svelte"
  import ModelSelectionPanel from "./model-selection-panel.svelte"
  import { popup } from "@skeletonlabs/skeleton"
  import { currentModel } from "$lib/stores/models"
</script>

<div class="flex place-items-center">
  <span class="font-bold select-none">{$currentModel?.name ?? "No models"}</span>
  <button
    class="btn-icon btn-icon-sm"
    use:popup={{
      event: "click",
      target: "popupModelSelection",
      closeQuery: '.listbox-item',
    }}
  >
    <IconSelector />
  </button>
  <ModelSelectionPanel />
</div>
