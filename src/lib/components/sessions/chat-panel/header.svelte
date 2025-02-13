<script lang="ts">
  import ModelSelector from "./header/model-selector.svelte"
  import { Label } from "$lib/components/ui/label"
  import { Switch } from "$lib/components/ui/switch"
  import { chatHistory } from "$lib/stores/chats"
  import { frontendState } from "$lib/stores/app-state"
  import { selectedSessionModel, usingSystemPrompt } from "$lib/stores/models"
  import { getModelSystemPrompt } from "$lib/commands/system-prompts"

  let systemPrompt = $state<string | null>("")

  $effect(() => {
    if ($frontendState.initialized && !$chatHistory && $selectedSessionModel) {
      getModelSystemPrompt($selectedSessionModel)
        .then(res => systemPrompt = res)
    } else {
      systemPrompt = null
    }
  })
</script>

<div class="sticky flex-shrink-0 border-b border-border h-12 flex items-center backdrop-blur-lg bg-background/50">
  <div class="flex-grow flex gap-2">
    <ModelSelector />
  </div>

  <div class="px-2">
    {#if systemPrompt}
      <div class="flex items-center gap-2 md:mr-4">
        <Switch id="use-system-prompt" bind:checked={() => $usingSystemPrompt, value => usingSystemPrompt.set(value)} />
        <Label for="use-system-prompt">Use system prompt</Label>
      </div>
    {/if}
  </div>
</div>
