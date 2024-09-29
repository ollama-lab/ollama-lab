<script lang="ts">
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
  import { IconCloudDownload } from "@tabler/icons-svelte"

  const modal: ModalSettings = {
    type: "prompt",
    title: "Pull model",
    body: "Enter model name here",
    valueAttr: {
      type: "text",
      placeholder: "E.g. llama3.2:3b",
      required: true,
    },
  }

  const modalStore = getModalStore()
</script>

<button
  class="btn-icon btn-icon-sm variant-soft"
  title="Pull model"
  on:click={() => modalStore.trigger(modal)}
>
  <IconCloudDownload />
</button>
