<script lang="ts" module>
  export function getRemainingSeconds(dateFrom: Date): number {
    return parseInt(((dateFrom.getTime() - new Date().getTime()) / 1000).toFixed(0))
  }
</script>

<script lang="ts">
  import type { Model, ModelInfo, RunningModel } from "$lib/models/model-item"
  import { PlaceholderTitle } from "."
  import StatusDot from "../custom-ui/status-dot.svelte"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
  import { Button } from "../ui/button"
  import { CopyIcon, TrashIcon } from "lucide-svelte"
  import { getModel } from "$lib/commands/models"
    import CodeBlock from "../code-block/code-block.svelte";
    import ScrollArea from "../ui/scroll-area/scroll-area.svelte";

  dayjs.extend(relativeTime)

  let { model, sessionExpiredAt = $bindable(), runningInfo }: {
    model?: string
    sessionExpiredAt?: Date
    runningInfo?: RunningModel
  } = $props()

  let modelInfo = $state<ModelInfo | undefined>()

  $effect(() => {
    if (!model) {
      modelInfo = undefined
      return
    }

    getModel(model).then(result => modelInfo = result)
  })

  let tabValue = $state<string>("modelfile")
</script>

{#if model}
  <div class="flex flex-col h-full px-4 py-6 gap-4 overflow-y-scroll">
    <div class="border border-border px-4 py-3 rounded flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-xl flex-grow">{model}</h3>
        <div class="flex gap-2 items-center">
          <Button>
            Set default
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Copy"
          >
            <CopyIcon />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            title="Delete"
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
      <div class="flex gap-2 items-center text-sm">
        <span class="flex items-center select-none">
          <StatusDot status={sessionExpiredAt ? "success" : "disabled"} />
          <span>
            {#if sessionExpiredAt}
              Active
            {:else}
              Inactive
            {/if}
          </span>
        </span>
        {#if sessionExpiredAt}
          <span
            title={sessionExpiredAt.toLocaleString()}
          >
            Expires in {getRemainingSeconds(sessionExpiredAt)} seconds
          </span>
        {/if}
      </div>
    </div>

    <div>
      <Tabs bind:value={tabValue}>
        <TabsList>
          <TabsTrigger value="modelfile">Modelfile</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <ScrollArea>
          <TabsContent value="modelfile">
            <CodeBlock lang="Modelfile">{modelInfo?.modelfile}</CodeBlock>
          </TabsContent>
          <TabsContent value="details">
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  </div>
{:else}
  <div class="flex flex-col place-items-center place-content-center h-full">
    <PlaceholderTitle />
  </div>
{/if}
