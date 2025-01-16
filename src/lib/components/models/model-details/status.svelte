<script lang="ts">
  import Countdown from "$lib/components/custom-ui/countdown.svelte"
  import StatusDot from "$lib/components/custom-ui/status-dot.svelte"
  import type { RunningModel } from "$lib/models/model-item"

  let { runningInfo, onExpire }: {
    runningInfo?: RunningModel
    onExpire?: () => void
  } = $props()

  let expiresInSeconds = $state<number>(0)
</script>

<div class="flex gap-2 items-center text-sm">
  <span class="flex items-center select-none">
    <StatusDot status={runningInfo ? "success" : "disabled"} />
    <span>
      {#if runningInfo}
        Active
      {:else}
        Inactive
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
