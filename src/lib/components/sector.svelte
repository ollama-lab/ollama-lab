<script lang="ts">
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
  import { IconBrain, IconMessageChatbot, IconSettings } from "@tabler/icons-svelte"

  const tabData = [
    {
      name: "sessions",
      label: "Sessions",
      icon: IconMessageChatbot,
    },
    {
      name: "models",
      label: "Models",
      icon: IconBrain,
    },
  ]

  const trailTabData = [
    {
      name: "settings",
      label: "Settings",
      icon: IconSettings,
    },
  ]

  export let currentTile: string

</script>

<AppRail class="dark:bg-surface-700 z-20">
  {#each tabData as { name, label, icon } (name)}
    <AppRailTile bind:group={currentTile} {name} value={name}>
      <svelte:fragment slot="lead">
        <svelte:component this={icon} class="mx-auto" />
      </svelte:fragment>
      <span>{label}</span>
    </AppRailTile>
  {/each}

  <svelte:fragment slot="trail">
    {#each trailTabData as { name, label, icon } (name)}
      <AppRailTile bind:group={currentTile} {name} value={name} title={label}>
        <svelte:component this={icon} class="mx-auto" />
      </AppRailTile>
    {/each}
  </svelte:fragment>
</AppRail>
