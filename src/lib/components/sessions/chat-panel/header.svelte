<script lang="ts">
  import ModelSelector from "./header/model-selector.svelte"
  import { Label } from "$lib/components/ui/label"
  import { Switch } from "$lib/components/ui/switch"
  import { chatHistory } from "$lib/stores/chats"
  import { frontendState } from "$lib/stores/app-state"
  import { selectedSessionModel } from "$lib/stores/models"
  import { getModelSystemPrompt } from "$lib/commands/system-prompts"
  import { inputPrompt } from "$lib/stores/prompt-input"
  import { Loading } from "$lib/components/ui/command"

</script>

<div class="sticky flex-shrink-0 border-b border-border h-12 flex items-center backdrop-blur-lg bg-background/50">
  <div class="flex-grow flex gap-2">
    <ModelSelector />
  </div>

  <div class="px-2">
    {#if $frontendState.initialized && !$chatHistory && $selectedSessionModel}
      {#await getModelSystemPrompt($selectedSessionModel)}
        <Loading />
      {:then systemPrompt}
        {#if systemPrompt}
          <div class="flex items-center gap-2 md:mr-4">
            <Switch
              id="use-system-prompt"
              bind:checked={() => $inputPrompt.useSystemPrompt ?? false, (value) => inputPrompt.update(o => {
                o.useSystemPrompt = value
                return o
              })}
            />
            <Label for="use-system-prompt">Use system prompt</Label>
          </div>
        {/if}
      {/await}
    {/if}
  </div>
</div>
