<script lang="ts">
  import Kbd from "$lib/components/custom-ui/kbd.svelte"
</script>

<table class="hint-table">
  <caption>Hints</caption>
  <tbody>
    <tr>
      <td><Kbd>Enter</Kbd></td><td>Send prompt</td>
    </tr>
    <tr>
      <td><Kbd>Shift</Kbd> + <Kbd>Enter</Kbd></td><td>New line</td>
    </tr>
  </tbody>
</table>

<style>
  @tailwind components;

  @layer components {
    table.hint-table tr > td:nth-child(1) {
      @apply text-end pr-2;
    }

    table.hint-table tr > td:nth-child(2) {
      @apply text-start;
    }
  }
</style>
