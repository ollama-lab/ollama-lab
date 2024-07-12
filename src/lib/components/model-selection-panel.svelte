<script lang="ts">
    import { getModalStore } from "@skeletonlabs/skeleton";
  import type { SvelteComponent } from "svelte";

  export let parent: SvelteComponent

  export let activeModel: string
  export let activeVariant: string

  const modalStore = getModalStore()

  const models = [
    "llama3",
    "mistral",
    "mixtral",
  ]

  const variants = [
    "7B",
    "13B",
    "20B",
  ]

</script>

{#if $modalStore[0]}
  <div class="card p-4 flex flex-col gap-4">
    {#if $modalStore[0].title}
      <header class="text-xl font-bold select-none">
        {$modalStore[0].title}
      </header>
    {/if}
    <div class="flex flex-col gap-2">
      <p class="text-xs text-secondary-600 dark:text-secondary-400 select-none">
        Fun fact: LLMs can technically pick up the conversations between you and other models :D
      </p>
      <div class="flex gap-2">
        <div class="flex-1 flex flex-col">
          <h4 class="text-sm">Model</h4>
          <select name="model" bind:value={activeModel} class="select">
            {#each models as model (model)}
              <option value={model}>{model}</option>
            {/each}
          </select>
        </div>
        <div class="flex-1 flex flex-col">
          <h4 class="text-sm">Variant</h4>
          <select name="variant" bind:value={activeVariant} class="select">
            {#each variants as variant (variant)}
              <option value={variant}>{variant}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    <footer class={parent.regionFooter}>
      <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
      <button
        class="btn {parent.buttonPositive}"
        on:click={() => {
          $modalStore[0].response?.call(null, { model: activeModel, variant: activeVariant })
          modalStore.close()
        }}
      >
        {parent.buttonTextConfirm}
      </button>
    </footer>
  </div>
{/if}
