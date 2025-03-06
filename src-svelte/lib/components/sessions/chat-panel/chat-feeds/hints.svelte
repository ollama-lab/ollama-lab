<script lang="ts">
  import Kbd from "$lib/components/custom-ui/kbd.svelte"

  const keyHints: { [key: string]: string } = {
    "Enter": "Send prompt",
    "Shift + Enter": "New line",
  }
</script>

<table class="hint-table">
  <tbody>
    {#each Object.entries(keyHints) as [key, value] (key)}
      <tr>
        <td class="text-end pr-2">
          {#each key.split(" ") as kbd}
            {#if kbd === "+" || kbd === "/"}
              {kbd}
            {:else}
              <Kbd>{kbd}</Kbd>
            {/if}
          {/each}
        </td>
        <td class="text-start">{value}</td>
      </tr>
    {/each}
  </tbody>
</table>
