<script lang="ts">
  import { restartVotes, settings } from "$lib/stores/settings"
  import { en } from "$lib/settings/names/en"
  import { settingsSchema } from "../schema"
  import { Button } from "$lib/components/ui/button"
  import SettingsSectionItem from "./settings-section-item.svelte"
  import { relaunch } from "@tauri-apps/plugin-process"
  import { Loader2Icon } from "lucide-svelte"

  const t = en

  let restarting = $state(false)
</script>

<div class="px-2 py-2 md:pt-10 md:pb-4 flex flex-col mx-auto max-w-screen-sm h-dvh">
  <div class="overflow-y-scroll flex flex-col gap-2 flex-grow">
    {#each Object.entries($settings) as [key, section] (`settings-section-${key}`)}
      <div class="flex flex-col gap-2">
        <h2 class="font-bold">{t[key]}</h2>

        {#each Object.entries(section) as [subkey,] (`settings-section-${key}-item-${subkey}`)}
          {#if settingsSchema[key][subkey]}
            <SettingsSectionItem {key} {subkey} />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
  <div class="flex">
    {#if $restartVotes.size > 0}
      <div class="flex flex-col">
        <Button onclick={() => {
          restarting = true
          relaunch()
        }} disabled={restarting}>
          {#if restarting}
            <Loader2Icon class="size-4 animate-spin" />
          {:else}
            Restart
          {/if}
        </Button>
      </div>
    {/if}
  </div>
</div>
