<script lang="ts">
  import type { Model, ModelInfo, RunningStatus } from "$lib/models/models"
  import { CodeBlock, popup, ProgressRadial, Tab, TabGroup } from "@skeletonlabs/skeleton"
  import { IconCloudUpload, IconCopy, IconDotsVertical, IconPointFilled, IconTrash } from "@tabler/icons-svelte"
  import convert from "convert"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import { getModelInfo } from "$lib/utils/commands"

  dayjs.extend(relativeTime)

  export let model: Model
  export let status: RunningStatus | null

  export let reloadRequired: boolean

  let modelInfo: ModelInfo | undefined

  const tabs: { value: string, label: string }[] = [
    { value: "details", label: "Details" },
    { value: "info", label: "Model info" },
    { value: "modelfile", label: "Modelfile" },
    { value: "params", label: "Parameters" },
    { value: "template", label: "Template" },
  ]

  let currentTab: string = "details"

  $: {
    if (reloadRequired) {
      modelInfo = undefined
    }

    getModelInfo(model.name).then(m => modelInfo = m)
    reloadRequired = false
  }

  $: expirationDate = status ? dayjs(status.expires_at) : undefined

  let interval: Timer | null = null

  let countdown: number | undefined = undefined

  function updateExpiration() {
    countdown = expirationDate?.diff(undefined, "seconds")
  }

  $: {
    if (expirationDate) {
      updateExpiration()

      if (!interval) {
        interval = setInterval(updateExpiration, 1_000)
      }
    } else {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
  }
</script>

<div class="w-full h-dvh flex flex-col">
  <div class="flex flex-col px-4 py-2 lg:px-8 lg:py-6 overflow-y-scroll">
    <div class="flex flex-col md:px-6 md:py-8 lg:px-12 lg:py-14 gap-5">
      <div class="flex-auto flex">
        <h1 class="font-bold text-2xl flex-auto">{model.name}</h1>
        <div class="flex place-items-center">
          <button class="btn-icon btn-icon-sm variant-ghost" use:popup={{
            event: "click",
            target: "popupOps",
            placement: "bottom-end",
          }}>
            <IconDotsVertical />
          </button>
          <div class="card" data-popup="popupOps">
            <ul class="list">
              <li>
                <button class="btn rounded-none flex place-content-center">
                  <IconCopy />
                  <span>Copy</span>
                </button>
              </li>
              <li>
                <button class="btn rounded-none flex place-content-center">
                  <IconCloudUpload />
                  <span>Push</span>
                </button>
              </li>
              <li>
                <button class="btn rounded-none flex place-content-center">
                  <IconTrash class="text-error-600 dark:text-error-400" />
                  <span>Delete</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        {#if status && countdown !== undefined && countdown >= 0}
          <div class="flex gap-1 place-items-center">
            <IconPointFilled class="text-green-600 dark:text-green-400" />
            <span>Running</span>
          </div>
          <div class="flex gap-4">
            <span title={model.size.toLocaleString() + " bytes"}>
              VRAM: {convert(status.size_vram, "byte").to("best", "imperial").toString(2)}
            </span>
            <span title={status.expires_at.toLocaleString()}>
              Session expiring in {countdown} second{countdown !== 1 ? "s" : ""}
            </span>
          </div>
        {:else}
          <div class="flex gap-1 place-items-center">
            <IconPointFilled class="text-gray-600 dark:text-gray-400" />
            <span>Inactive</span>
          </div>
        {/if}
      </div>
    </div>
    <div class="flex flex-col card px-3 py-2">
      <TabGroup>
        {#each tabs as { value, label } (value)}
          <Tab bind:group={currentTab} name="{value}Tab" {value}>{label}</Tab>
        {/each}

        <svelte:fragment slot="panel">
          <div class="flex flex-col gap-1 px-3 py-4">
            {#if modelInfo}

              {#if currentTab === "details"}
                <span>Model family: {modelInfo.details.family}</span>
                <span>Parent model: {modelInfo.details.parent_model || "(none)"}</span>
                <span>Parameter size: {modelInfo.details.parameter_size}</span>
                <span>Format: {modelInfo.details.format}</span>
                <span>Model size: {convert(model.size, "byte").to("best", "imperial").toString(2)} ({model.size.toLocaleString()} bytes)</span>
                <span>Quantization Level: {modelInfo.details.quantization_level}</span>
              {:else if currentTab === "info"}
                <div class="table-container">
                  <table class="table table-hover">
                    {#each Object.entries(modelInfo.model_info) as [key, value] (key)}
                      <tr class="border-b border-surface-400 dark:border-surface-700">
                        <td>{key}</td>
                        <td>{value?.toString() ?? "N/A"}</td>
                      </tr>
                    {/each}
                  </table>
                </div>
              {:else if currentTab === "modelfile"}
                <CodeBlock language="modelfile" code={modelInfo.modelfile} buttonCopied="Copied" />
              {:else if currentTab === "params"}
                <CodeBlock code={modelInfo.parameters} buttonCopied="Copied" />
              {:else if currentTab === "template"}
                <CodeBlock code={modelInfo.template} buttonCopied="Copied" />
              {/if}

            {:else}
              <ProgressRadial width="w-10" class="place-self-center" />
            {/if}
          </div>
        </svelte:fragment>
      </TabGroup>
    </div>
  </div>
</div>
