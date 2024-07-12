<script lang="ts">
  import Chatbox from "$lib/components/chatbox.svelte"
  import Header from "$lib/components/header.svelte"
  import Sector from "$lib/components/sector.svelte"
  import ModelZoo from "$lib/components/model-zoo.svelte"

  let opened = false

  function toggleOpened() {
    opened = !opened
  }

  let customTitlebar = false

  let currentTile: string = "sessions"
</script>

<main class="size-full flex flex-col">
  <div>
    {#if customTitlebar}
      <Header />
    {/if}
  </div>
  <div class="flex-grow flex">
    <div class="h-full">
      <Sector bind:currentTile={currentTile} />
    </div>
    <div class="flex-grow">
      {#if currentTile === "sessions"}
        <Chatbox />
      {:else if currentTile === "models"}
        <ModelZoo />
      {/if}
    </div>
  </div>
</main>
