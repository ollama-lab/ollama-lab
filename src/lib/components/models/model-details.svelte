<script lang="ts" module>
  export function getRemainingSeconds(dateFrom: Date): number {
    return parseInt(((dateFrom.getTime() - new Date().getTime()) / 1000).toFixed(0))
  }
</script>

<script lang="ts">
  import type { ModelInfo, RunningModel } from "$lib/models/model-item"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
  import { getModel } from "$lib/commands/models"
  import ScrollArea from "../ui/scroll-area/scroll-area.svelte"
  import Modelfile from "./model-details/modelfile.svelte"
  import Details from "./model-details/details.svelte"
  import Info from "./model-details/info.svelte"
  import Parameters from "./model-details/parameters.svelte"
  import Template from "./model-details/template.svelte"
  import { defaultModel } from "$lib/stores/models"
  import SetDefault from "./model-details/toolbar/set-default.svelte"
  import Status from "./model-details/status.svelte"
  import { Badge } from "../ui/badge"
  import DuplicateModel from "./model-details/toolbar/duplicate-model.svelte"
  import DeleteModel from "./model-details/toolbar/delete-model.svelte"
  import PlaceholderTitle from "./placeholder-title.svelte";
  import Loading from "../custom-ui/loading.svelte"
  import { toast } from "svelte-sonner"

  dayjs.extend(relativeTime)

  let { model, runningInfo, onExpire }: {
    model?: string
    runningInfo?: RunningModel
    onExpire?: () => void
  } = $props()

  let modelInfo = $state<ModelInfo | undefined>()
  let loading = $state(false)

  $effect(() => {
    modelInfo = undefined

    if (model) {
      loading = true
      getModel(model).then(result => modelInfo = result)
        .catch(err => toast.error(err))
        .finally(() => loading = false)
    }
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
          {#if $defaultModel !== model}
            <SetDefault {model} />
          {/if}
          <DuplicateModel {model} />
          <DeleteModel {model} />
        </div>
      </div>
      <Status {runningInfo} {onExpire} />
    </div>

    <div>
      {#if loading}
        <Loading content="Loading..." />
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
            <TabsTrigger value="params">Parameters</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          <ScrollArea>
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
          </ScrollArea>
        </Tabs>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex flex-col place-items-center place-content-center h-full">
    <PlaceholderTitle />
  </div>
{/if}
