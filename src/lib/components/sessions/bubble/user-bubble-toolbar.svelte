<script lang="ts">
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
  import { SquarePenIcon } from "lucide-svelte"

  let {
    editingMode = $bindable(),
  }: {
    editingMode: boolean
  } = $props()
</script>

<div>
  <MicroButton
    title="Edit"
    onclick={() => editingMode = true}
  >
    <SquarePenIcon class="size-4" />
  </MicroButton>
</div>
