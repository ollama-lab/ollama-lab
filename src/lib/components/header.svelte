<script>
  import { AppBar } from "@skeletonlabs/skeleton"
  import { IconSquare, IconX } from "@tabler/icons-svelte";
</script>

<AppBar class="!p-0">
  <svelte:fragment slot="trail">
    <div class="flex gap-0 my-0">
      <button class="btn btn-sm variant-soft">
        _
      </button>
      <button class="btn btn-sm variant-soft">
        <IconSquare />
      </button>
      <button class="btn btn-sm variant-soft hover:bg-red-600">
        <IconX />
      </button>
    </div>
  </svelte:fragment>
</AppBar>
