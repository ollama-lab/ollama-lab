<script lang="ts">
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
import { IconDotsVertical, IconMessageCirclePlus } from "@tabler/icons-svelte";

  let sessions: { id: number, title: string }[] = [
    {
      id: 1,
      title: "What is this?",
    },
    {
      id: 2,
      title: "What is that?",
    },
  ]

  export let activeSession: number | null

</script>

<div class="flex flex-col px-2 bg-surface-200 dark:bg-surface-800 h-dvh md:w-60 lg:w-80 xl:w-96">
  <div class="flex flex-row place-items-center">
    <span class="flex-auto font-bold px-2 text-lg py-4 select-none">Sessions</span>
    <div>
      <button
        class="btn-icon variant-ghost"
        type="button"
        title="New session"
        on:click={() => activeSession = null}
      >
        <IconMessageCirclePlus />
      </button>
    </div>
  </div>
  <div class="flex-auto overflow-y-scroll">
    <ListBox>
      {#each sessions as { id, title } (id)}
        <ListBoxItem bind:group={activeSession} name="session" value={id} class="group">
          <span class="flex-auto truncate">{title}</span>
          <svelte:fragment slot="trail">
            <button type="button" class="btn-icon bg-initial btn-icon-sm opacity-0 group-hover:opacity-100">
              <IconDotsVertical />
            </button>
          </svelte:fragment>
        </ListBoxItem>
      {/each}
    </ListBox>
  </div>
</div>
