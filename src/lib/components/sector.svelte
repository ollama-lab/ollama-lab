<script lang="ts">
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
  import { IconBrain, IconMessageChatbot } from "@tabler/icons-svelte"
  import type { SvelteComponent } from "svelte"

  const tabData: { name: string, label: string, icon: SvelteComponent }[] = [
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

  export let currentTile: string

</script>

<AppRail>
  {#each tabData as { name, label, icon } (name)}
    <AppRailTile bind:group={currentTile} {name} value={name}>
      <svelte:fragment slot="lead">
        <svelte:component this={icon} class="mx-auto" />
      </svelte:fragment>
      <span>{label}</span>
    </AppRailTile>
  {/each}
</AppRail>
