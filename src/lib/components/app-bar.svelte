<script lang="ts">
  import type { Section } from "$lib/models/section"
  import { BotMessageSquareIcon, PackageIcon, SettingsIcon } from "lucide-svelte"
  import TabLink from "./app-bar/tab-link.svelte"
  import { page } from "$app/state"

  const tabs: Section[] = [
    {
      name: "Sessions",
      icon: BotMessageSquareIcon,
      href: "/",
      activePattern: /^\/$/,
    },
    {
      name: "Models",
      icon: PackageIcon,
      href: "/models",
      activePattern: /^\/models(\/*.)?/,
    },
  ]

  const footerTabs: Section[] = [
    {
      name: "Settings",
      icon: SettingsIcon,
      href: "/settings",
      activePattern: /^\/settings(\/*.)?/,
    },
  ]
</script>

<nav class="flex flex-col border-r border-border px-1 py-1">
  <div class="flex-grow flex flex-col">
    {#each tabs as { name, icon, href, activePattern, onClick }}
      <TabLink
        {href}
        {onClick}
        {name}
        active={activePattern?.test(page.url.pathname)}
      >
        <svelte:component this={icon} />
      </TabLink>
    {/each}
  </div>
  <div class="flex-shrink-0 flex flex-col">
    {#each footerTabs as { name, icon, href, activePattern, onClick }}
      <TabLink
        {href}
        {onClick}
        {name}
        active={activePattern?.test(page.url.pathname)}
      >
        <svelte:component this={icon} />
      </TabLink>
    {/each}
  </div> 
</nav>
