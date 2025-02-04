<script lang="ts">
  import { settings } from "$lib/stores/settings"
  import { en } from "$lib/settings/names/en"
  import SidebarSectionItem from "./sidebar/sidebar-section-item.svelte"

  const t = en
</script>

<div class="overflow-y-scroll">
  {#each Object.entries($settings) as [key, section] (`settings-section-${key}`)}
    <h2>{t[key]}</h2>

    {#each Object.entries(section) as [subkey,] (`settings-section-${key}-item-${subkey}`)}
      <SidebarSectionItem {key} {subkey} />
    {/each}
  {/each}
</div>
