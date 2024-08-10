<script lang="ts">
  import { IconCloudDownload, IconPlus, IconPointFilled, IconTrash } from "@tabler/icons-svelte"
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton"
  import TimeAgo from "javascript-time-ago"
  import convert from "convert"
  import { modelList, runningModels } from "$lib/stores/models"

  export let selectedModel: string | null

  const timeAgo = new TimeAgo("en-US")
</script>

<div class="flex flex-col h-dvh px-2 gap-4 bg-surface-200 dark:bg-surface-800 md:w-60 lg:w-80 xl:w-96">
  <div class="flex flex-row place-items-center pt-4">
    <h1 class="flex-auto font-bold px-2 text-lg select-none">Models</h1>
    <div class="flex gap-2 place-items-center">
      <button
        class="btn-icon btn-icon-sm variant-soft"
        title="Create model"
      >
        <IconPlus />
      </button>
      <button
        class="btn-icon btn-icon-sm variant-soft"
        title="Pull model"
      >
        <IconCloudDownload />
      </button>
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
        >
          <div class="group flex">
            <div class="flex flex-col flex-auto">
              <div class="flex">
                <span class="font-semibold">{model.name}</span>
                {#if $runningModels.find(m => m.name === model.name)}
                  <span title="Running"><IconPointFilled class="text-green-600 dark:text-green-400" /></span>
                {/if}
              </div>
              <div class="flex place-items-center text-xs gap-2">
                <span>{convert(model.size, "byte").to("best", "imperial").toString(2)}</span>
                <span title={model.modified_at.toString()}>Updated {timeAgo.format(model.modified_at)}</span>
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
