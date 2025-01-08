<script lang="ts">
  import type { ChatBubble, ChatHistory } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import { BubbleSector } from "../bubble"
  import Hints from "./chat-feeds/hints.svelte"

  // TODO: This is placeholder data
  let chatHistory: ChatHistory | undefined = {
    sessionId: 1,
    bubbles: [
      {
        id: 1,
        role: "user",
        content: "Why is the sky blue?",
        dateSent: new Date(2025, 1, 8, 10, 18, 10),
        status: "sent",
      },
      {
        id: 2,
        role: "assistant",
        content: `\
The sky appears blue because of a phenomenon called scattering, which occurs when sunlight interacts with the tiny molecules of gases in the Earth's
atmosphere. Here's a simplified explanation:

1. **Sunlight**: When the sun shines, it emits light across the entire visible spectrum (all colors), including red, orange, yellow, green, blue, indigo,
and violet.
2. **Atmospheric particles**: The tiny molecules of gases in the Earth's atmosphere, such as nitrogen (N2) and oxygen (O2), are present everywhere.
3. **Scattering**: When sunlight enters the atmosphere, these gas molecules scatter the shorter (blue) wavelengths more than the longer (red)
wavelengths. This is known as Rayleigh scattering, named after the British physicist Lord Rayleigh, who first described it in the 19th century.
4. **Blue light scattered everywhere**: As a result of this scattering process, the blue light is distributed throughout the atmosphere, reaching our
eyes from all directions.
5. **Perception**: Our eyes perceive the scattered blue light as the dominant color of the sky because our brains are wired to detect and interpret
visual cues in a way that emphasizes the shorter wavelengths.

So, to summarize: the sky appears blue because:

* Sunlight contains all colors of light
* Atmospheric particles scatter the shorter (blue) wavelengths more than longer (red) wavelengths
* The scattered blue light is distributed throughout the atmosphere, reaching our eyes from all directions

This is why we see a blue sky during the day, especially at high altitudes where there are fewer atmospheric particles to scatter the light.

Would you like me to explain any part of this process in more detail or clarify anything?`,
        dateSent: new Date(2025, 1, 8, 10, 49, 20),
        model: "llama3.2:3b",
        status: "sent",
      },
    ],
  }

  let continuedBubbles: ChatBubble[] = [
    {
      id: 3,
      role: "user",
      content: "So why is t",
      dateSent: new Date(2025, 1, 8, 10, 52, 51),
      status: "not sent",
    },
  ]
</script>

<div>
  <div
    class={cn(
      "flex flex-col",
      !chatHistory && "h-full place-content-center items-center",
    )}
  >
    {#if chatHistory}
      {#each chatHistory.bubbles as bubble, i (bubble.id)}
        <BubbleSector data={bubble} />
      {/each}
      {#each continuedBubbles as bubble (bubble.id)}
        <BubbleSector data={bubble} />
      {/each}
    {:else}
      <div class="text-center">
        <span class="select-none font-bold text-2xl">Hello there! 👋</span>
        <Hints />
      </div>
    {/if}
  </div>
</div>
