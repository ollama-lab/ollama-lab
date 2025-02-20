<script lang="ts">
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { readFile } from "@tauri-apps/plugin-fs"

  let { paths }: {
    paths: string[]
  } = $props()
</script>

<div class="flex gap-2 overflow-x-auto">
</div>
