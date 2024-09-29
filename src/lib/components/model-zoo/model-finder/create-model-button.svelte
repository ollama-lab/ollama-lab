<script lang="ts">
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
  import { IconPlus } from "@tabler/icons-svelte"

  const modal: ModalSettings = {
    type: "prompt",
    title: "Create model",
    body: "Model name",
  }

  const modalStore = getModalStore()
</script>

<button
  class="btn-icon btn-icon-sm variant-soft"
  title="Create model"
  on:click={() => modalStore.trigger(modal)}
>
  <IconPlus />
</button>
