<script lang="ts" module>
  export function getRemainingSeconds(dateFrom: Date): number {
    return parseInt(((dateFrom.getTime() - new Date().getTime()) / 1000).toFixed(0))
  }
</script>

<script lang="ts">
  import type { ModelInfo, RunningModel } from "$lib/models/model-item"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
  import { getModel } from "$lib/commands/models"
  import Modelfile from "./model-details/modelfile.svelte"
  import Details from "./model-details/details.svelte"
  import Info from "./model-details/info.svelte"
  import Parameters from "./model-details/parameters.svelte"
  import Template from "./model-details/template.svelte"
  import { activeModels, defaultModel } from "$lib/stores/models"
  import SetDefault from "./model-details/toolbar/set-default.svelte"
  import Status from "./model-details/status.svelte"
  import { Badge } from "../ui/badge"
  import DuplicateModel from "./model-details/toolbar/duplicate-model.svelte"
  import DeleteModel from "./model-details/toolbar/delete-model.svelte"
  import PlaceholderTitle from "./placeholder-title.svelte"
  import Loading from "../custom-ui/loading.svelte"
  import { toast } from "svelte-sonner"
  import { pullModelTasks } from "$lib/stores/pull-model"
  import ProgressSize from "../custom-ui/progress-size.svelte"
  import { Progress } from "../ui/progress"
  import { onMount } from "svelte"

  let { model, runningInfo, onExpire }: {
    model?: string
    runningInfo?: RunningModel
    onExpire?: () => void
  } = $props()

  let modelInfo = $state<ModelInfo | undefined>()
  let loading = $state(false)

  let downloadInfo = $derived(model ? $pullModelTasks[model] : undefined)

  $effect(() => {
    modelInfo = undefined

    if (model && (!downloadInfo || downloadInfo.type === "success")) {
      loading = true
      getModel(model).then(result => modelInfo = result)
        .catch(err => toast.error(err))
        .finally(() => loading = false)
    }
  })

  onMount(() => {
    activeModels.reload()
  })

  let tabValue = $state<string>("details")
</script>

{#if model}
  <div class="flex flex-col h-full px-4 py-6 gap-4 overflow-y-scroll">
    <div class="border border-border px-4 py-3 rounded flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-xl">{model}</h3>
        {#if $defaultModel === model}
          <Badge variant="outline">
            Default
          </Badge>
        {/if}
        <div class="flex-grow"></div>
        <div class="flex gap-2 items-center">
          {#if !downloadInfo}
            {#if $defaultModel !== model}
              <SetDefault {model} />
            {/if}
            <DuplicateModel {model} />
            <DeleteModel {model} />
          {/if}
        </div>
      </div>
      <Status {runningInfo} {onExpire} {downloadInfo} />
    </div>

    <div>
      {#if loading}
        <Loading content="Loading..." />
      {/if}

      {#if downloadInfo && downloadInfo.type === "inProgress"}
        <div class="flex text-sm gap-2 md:gap-4 items-center">
          <Progress
            value={downloadInfo.completed && downloadInfo.total ? downloadInfo.completed / downloadInfo.total * 100 : null}
            class={"h-2 max-w-80"}
          />
          <ProgressSize completedSize={downloadInfo.completed ?? undefined} totalSize={downloadInfo.total ?? undefined} />
        </div>
      {/if}

      {#if modelInfo}
        <Tabs bind:value={tabValue}>
          <TabsList>
            {#if modelInfo.details}
              <TabsTrigger value="details">Details</TabsTrigger>
            {/if}
            <TabsTrigger value="modelfile">Modelfile</TabsTrigger>
            {#if modelInfo.model_info}
              <TabsTrigger value="info">Model Info</TabsTrigger>
            {/if}
            {#if modelInfo.parameters}
              <TabsTrigger value="params">Parameters</TabsTrigger>
            {/if}
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          <div class="overflow-y-scroll">
            <TabsContent value="modelfile">
              <Modelfile value={modelInfo.modelfile} />
            </TabsContent>
            {#if modelInfo.details}
              <TabsContent value="details">
                <Details value={modelInfo.details} />
              </TabsContent>
            {/if}
            {#if modelInfo.model_info}
              <TabsContent value="info">
                <Info value={modelInfo.model_info} />
              </TabsContent>
            {/if}
            <TabsContent value="params">
              <Parameters value={modelInfo.parameters} />
            </TabsContent>
            <TabsContent value="template">
              <Template value={modelInfo.template} />
            </TabsContent>
          </div>
        </Tabs>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex flex-col place-items-center place-content-center h-full">
    <PlaceholderTitle />
  </div>
{/if}
