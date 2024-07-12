<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { IconSelector } from "@tabler/icons-svelte";
    import ModelSelectionPanel from "./model-selection-panel.svelte";

  export let model: string

  export let variant: string

  const modalStore = getModalStore()
</script>

<div class="flex place-items-center">
  <span class="font-bold select-none">{model}:{variant}</span>
  <button
    class="btn-icon btn-icon-sm"
    on:click={() => modalStore.trigger({
      type: "component",
      component: {
        ref: ModelSelectionPanel,
        props: {
          activeModel: model,
          activeVariant: variant,
        },
      },
      title: "Choose an installed model",
      response: r => {
        if (!r) return

        model = r.model
        variant = r.variant
      }
    })}
  >
    <IconSelector />
  </button>
</div>
