<script lang="ts">
  import type { SidebarOption } from "../viewmodels/option";

  export let options: SidebarOption[];
</script>

<div>
<ul>
  {#each options as option (option.id)}
    <li>
      {option.name}
    </li>
  {/each}
</ul>
</div>
