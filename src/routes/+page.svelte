<script lang="ts">
  import Chatbox from "$lib/components/chatbox.svelte"
  import Header from "$lib/components/header.svelte"
  import Sector from "$lib/components/sector.svelte"
  import ModelZoo from "$lib/components/model-zoo.svelte"
  import SettingsPage from "$lib/components/settings-page.svelte"
  import { Toast } from "@skeletonlabs/skeleton"
  
  let customTitlebar = false

  let currentTile: string = "sessions"
</script>

<main class="size-full flex flex-col">
  <Toast />
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
      {:else if currentTile === "settings"}
        <SettingsPage />
      {/if}
    </div>
  </div>
</main>
