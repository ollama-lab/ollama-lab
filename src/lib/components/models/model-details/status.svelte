<script lang="ts">
  import Countdown from "$lib/components/custom-ui/countdown.svelte"
  import StatusDot from "$lib/components/custom-ui/status-dot.svelte"
  import type { ProgressEvent } from "$lib/models/events/progress"
  import type { RunningModel } from "$lib/models/model-item"
  import { Loader2Icon } from "lucide-svelte"

  let {
    runningInfo,
    onExpire,
    downloadInfo,
  }: {
    runningInfo?: RunningModel
    onExpire?: () => void
    downloadInfo?: ProgressEvent
  } = $props()

  let expiresInSeconds = $state<number>(0)
</script>

<div class="flex gap-2 items-center text-sm">
  <span class="flex items-center select-none">
    {#if downloadInfo && downloadInfo.type === "inProgress"}
      <Loader2Icon class="size-4 animate-spin mr-2" />
    {:else}
      <StatusDot status={downloadInfo?.type === "failure" ? "error" : runningInfo ? "success" : "disabled"} />
    {/if}
    <span>
      {#if downloadInfo}
        {#if downloadInfo.type === "inProgress"}
          {downloadInfo.message}
        {/if}
        {#if downloadInfo.type === "failure"}
          Error: {downloadInfo.message}
        {/if}
      {:else}
        {#if runningInfo}
          Active
        {:else}
          Inactive
        {/if}
      {/if}
    </span>
  </span>
  {#if runningInfo}
    <hr class="bg-border h-full w-[2pt]" />
    <span
      title={runningInfo.toLocaleString()}
      class="space-x-1"
    >
      Session expires in
      <Countdown bind:seconds={expiresInSeconds} expireAt={runningInfo.expires_at} {onExpire} />
      second{expiresInSeconds !== 1 ? "s" : ""}
    </span>
  {/if}
</div>
