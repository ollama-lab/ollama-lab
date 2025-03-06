<script lang="ts">
  import { getModelSystemPrompt, setModelSystemPrompt } from "$lib/commands/system-prompts"
  import { Textarea } from "$lib/components/ui/textarea"
  import { frontendState } from "$lib/stores/app-state"

  let { model }: { model: string } = $props()

  let promptInfo = $state<{ model: string, content: string }>()

  $effect(() => {
    if (!promptInfo || model !== promptInfo.model) {
      if ($frontendState.initialized) {
        getModelSystemPrompt(model)
          .then(res => promptInfo = {
            model,
            content: res ?? "",
          })
      }
    }
  })
</script>

<div class="flex flex-col px-2 py-2 gap-2">
  <div class="text-sm text-muted-foreground">
    <p>Tell the model how to behave. System prompts in existing sessions will not be changed.</p>
  </div>

  <Textarea
    bind:value={() => promptInfo?.content, (value) => promptInfo = { model, content: value ?? "" }}
    onblur={async () => {
      if (promptInfo) {
        promptInfo = {
          model,
          content: await setModelSystemPrompt(model, promptInfo.content) ?? "",
        }
      }
    }}
  />
</div>
