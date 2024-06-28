<script lang="ts">
  import type { SidebarOption } from "../viewmodels/option";
  import { createMenubar, melt } from "@melt-ui/svelte";

  const {
    elements: { menubar },
    builders: { createMenu },
  } = createMenubar();

  const {
    elements: { menu },
  } = createMenu();

  export let options: SidebarOption[];
</script>

<div class="flex flex-col" use:melt={$menubar}>
  <ul class="flex flex-col" use:melt={$menu}>
    {#each options as option (option.id)}
      <li>
        {option.name}
      </li>
    {/each}
  </ul>
</div>
