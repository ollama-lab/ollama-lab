<script lang="ts">
  import { page } from "$app/state"
  import { Button } from "$lib/components/ui/button"
  import type { Section } from "$lib/models/section"
  import { BotMessageSquareIcon, PackageIcon, SettingsIcon } from "lucide-svelte"

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

<nav class="flex flex-col">
  <div class="flex-grow flex flex-col">
    {#each tabs as { name, icon, href, activePattern, onClick }}
      <Button
        variant={activePattern?.test(page.url.pathname) ? "outline" : "ghost"}
        {href}
        onclick={() => onClick?.()}
        size="icon"
        title={name}
      >
        <svelte:component this={icon} />
      </Button>
    {/each}
  </div>
  <div class="flex-shrink-0">
    {#each footerTabs as { name, icon, href, activePattern, onClick }}
      <Button
        variant={activePattern?.test(page.url.pathname) ? "outline" : "ghost"}
        {href}
        onclick={() => onClick?.()}
        size="icon"
        title={name}
      >
        <svelte:component this={icon} />
      </Button>
    {/each}
  </div> 
</nav>
