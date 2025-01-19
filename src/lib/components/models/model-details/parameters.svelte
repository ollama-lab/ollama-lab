<script lang="ts">
  import { CodeBlock } from "$lib/components/code-block"

  let { value }: { value?: string } = $props()
</script>

<CodeBlock lang="plaintext">{value?.trim()}</CodeBlock>
