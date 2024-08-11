<script lang="ts">
  import { IconPointFilled, IconTrash } from "@tabler/icons-svelte"
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton"
  import convert from "convert"
  import { modelList, runningModels } from "$lib/stores/models"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import RefreshButton from "./model-finder/refresh-button.svelte"
  import CreateModelButton from "./model-finder/create-model-button.svelte"
  import PullModelButton from "./model-finder/pull-model-button.svelte"

  dayjs.extend(relativeTime)

  export let selectedModel: string | null

  export let reloadRequired: boolean 
</script>

<div class="flex flex-col h-dvh px-2 gap-4 bg-surface-200 dark:bg-surface-800 md:w-60 lg:w-80 xl:w-96">
  <div class="flex flex-row place-items-center pt-4">
    <h1 class="flex-auto font-bold px-2 text-lg select-none">Models</h1>
    <div class="flex gap-2 place-items-center">
      <CreateModelButton />
      <RefreshButton />
      <PullModelButton />
    </div>
  </div>
  <div class="flex-auto overflow-y-scroll">
    <ListBox>
      {#each $modelList as model (model.name)}
        <ListBoxItem
          bind:group={selectedModel}
          name="model"
          value={model.name}
          rounded="rounded-xl"
          active="variant-ghost"
          on:click={() => reloadRequired = true}
        >
          <div class="group flex">
            <div class="flex flex-col flex-auto">
              <div class="flex place-items-center">
                <span class="font-semibold">{model.name}</span>
                {#if $runningModels.find(m => m.name === model.name)}
                  <span title="Running"><IconPointFilled class="text-green-600 dark:text-green-400" /></span>
                {/if}
              </div>
              <div class="flex place-items-center text-xs gap-2">
                <span>{convert(model.size, "byte").to("best", "imperial").toString(2)}</span>
                <span title={model.modified_at.toLocaleString()}>Updated {dayjs(model.modified_at).fromNow()}</span>
              </div>
            </div>
            <div class="flex">
              <button class="btn-icon btn-icon-sm text-error-600 dark:text-error-400 opacity-0 group-hover:opacity-100">
                <IconTrash />
              </button>
            </div>
          </div>
        </ListBoxItem>
      {/each}
    </ListBox>
  </div>
</div>
