<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import SectorFooter from "./sector-footer.svelte"
  import Bubble from "./bubble.svelte"
  import { Avatar } from "$lib/components/ui/avatar"
  import { TriangleAlertIcon } from "lucide-svelte"
  import VersionPagination from "./version-pagination.svelte"
  import ThoughtsSection from "./thoughts-section.svelte"
  import BubbleEditor from "./bubble-editor.svelte"
  import { chatHistory } from "$lib/stores/chats"
  import AvatarImage from "$lib/components/ui/avatar/avatar-image.svelte"
  import SystemPromptBlock from "./system-prompt-block.svelte"

  let { data }: { data: ChatBubble } = $props()

  let editingMode = $state(false)
</script>

{#if data.role === "user" || data.role === "assistant"}
  <div
    class={cn(
      "group/bubble-sector flex py-1 gap-2 items-center",
      data.role === "user" ? "place-content-end" : "place-content-start",
    )}
  >
    <div class="flex flex-col w-full">
      <div class="flex gap-2 w-full">
        {#if data.role === "assistant"}
          <Avatar>
            <AvatarImage src="/ollama.svg" alt="Ollama logo" class="bg-white p-1 pb-0" />
          </Avatar>
        {/if}

        <div
          class={cn(
            "flex flex-col gap-1 w-full",
            data.role === "user" && "items-end",
          )}
        >
          <span class="text-xs font-bold">
            {#if data.role === "assistant"}
              {data.model}
            {:else if data.role === "user"}
              You
            {/if}
          </span>
          {#if data.imageCount > 0}
            <div class="bg-secondary border border-border text-xl flex items-center place-content-center w-28 h-28">
              +{data.imageCount}
            </div>
          {/if}
          {#if data.role === "assistant"}
            <ThoughtsSection {data} />
          {/if}
          {#if editingMode}
            <BubbleEditor
              defaultValue={data.content}
              onCancel={() => {
                editingMode = false
              }}
              onSubmit={(newValue) => {
                chatHistory.editPrompt({
                  text: newValue,
                }, data.id, {
                  onRespond() {
                    editingMode = false
                  },
                })
              }}
            />
          {:else}
            <Bubble {data} />
          {/if}

          {#if data.versions}
            <div class="flex gap-2 items-center">
              <VersionPagination versions={data.versions} current={data.id} />
            </div>
          {/if}

          <SectorFooter {data} bind:editingMode />
        </div>
      </div>
    </div>

    {#if data.role === "user"}
      {#if data.status === "sending"}
        <Loading />
      {:else if data.status === "not sent"}
        <TriangleAlertIcon class="text-yellow-600" />
      {/if}
    {/if}
  </div>
{:else if data.role === "system"}
  <SystemPromptBlock content={data.content} />
{/if}
