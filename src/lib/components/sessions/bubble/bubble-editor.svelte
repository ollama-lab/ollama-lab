<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Textarea } from "$lib/components/ui/textarea"
  import { ArrowUpIcon, XIcon } from "lucide-svelte"

  let {
    defaultValue,
    onCancel,
    onSubmit,
  }: {
    defaultValue?: string
    onCancel: () => void
    onSubmit: (newValue: string) => void
  } = $props()

  let value = $state(defaultValue)
</script>

<div class="flex flex-col gap-2 w-full px-2">
  <Textarea
    bind:value
    class="w-full"
    autofocus
  />

  <div class="flex gap-2 place-content-end">
    <Button
      variant="secondary"
      size="icon"
      title="Cancel"
      onclick={() => onCancel()}
      class="rounded-full size-8"
    >
      <XIcon />
    </Button>

    <Button
      size="icon"
      onclick={() => onSubmit(value ?? "")}
      title="Submit"
      class="rounded-full size-8"
      disabled={value === defaultValue}
    >
      <ArrowUpIcon />
    </Button>
  </div>
</div>
