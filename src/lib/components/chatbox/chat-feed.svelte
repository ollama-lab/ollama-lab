<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
    import ModelSelector from "../model-selector.svelte";
    import PromptEntry from "./prompt-entry.svelte";
    import Welcome from "./chat-feed/welcome.svelte";
    import BubbleList from "./bubble-list.svelte";
    import type { Feed } from "$lib/models/feed";

  export let activeSession: number | null

  // TODO: Remove placeholder data when the backend is ready
  let feeds: Feed[] = [
    {
      user: {
        username: "Charles",
      },
      content: "What is the biggest building in the world?",
      date: new Date("5/12/2024 15:51:22"),
      isEdited: false,
    },
    {
      status: "completed",
      model: "llama3:7B",
      content: `\
The largest building in the world is the Abraj Khalid Tower, also known as the Makkah Clock Tower, located in Mecca, Saudi Arabia. It was completed in 2012 and stands at a
height of 601 meters (1,972 feet) with 120 floors.

This massive structure serves as a mixed-use building, featuring:

1. A luxurious hotel, the Pullman ZamZam Makkah
2. Residential apartments
3. Office spaces
4. Retail stores and restaurants
5. A clock tower that is visible from anywhere in Mecca

The Abraj Khalid Tower was designed by the architecture firm Dar Al-Handasah (now known as Dar Group) and took around 6 years to construct, employing over 20,000 workers.

Interestingly, this building is not only a marvel of engineering but also holds significant cultural importance for Muslims worldwide. The clock tower's design is inspired by
Islamic architectural styles, and it has become an iconic landmark in the holy city of Mecca.

Would you like to know more about this incredible structure or perhaps explore other fascinating buildings around the world?\
`,
      date: new Date("5/12/2024 15:52:10"),
    },
    {
      user: {
        username: "Charles",
      },
      content: "Can you compare the top 10 tallest buildings?",
      date: new Date("5/12/2024 15:51:22"),
      isEdited: true,
    },
    {
      status: "completed",
      model: "llama3:7B",
      content: `\
Here's a comparison of the top 10 tallest buildings in the world, based on data from the Council on Tall Buildings and Urban Habitat (CTBUH) as of 2021:

**Rank** | **Building Name** | **Height (meters)** | **Height (feet)** | **Floors** | **City**
---------|-------------------|---------------|-------------|----------|--------
1. **Burj Khalifa** | 828 | 2,722 | 163 | Dubai, UAE
2. **Abraj Khalid Tower** | 601 | 1,972 | 120 | Mecca, Saudi Arabia
3. **Tokyo Skytree** | 604 | 1,982 | - | Tokyo, Japan
4. **Shanghai Tower** | 632 | 2,072 | 128 | Shanghai, China
5. **Abu Dhabi Plaza** | 530 | 1,739 | 74 | Abu Dhabi, UAE
6. **Ping An Finance Center** | 599 | 1,965 | 115 | Shenzhen, China
7. **Lotte World Tower** | 555 | 1,821 | 123 | Seoul, South Korea
8. **One World Trade Center** | 541 | 1,776 | 104 | New York City, USA
9. **Canton Tower** | 599 | 1,965 | 98 | Guangzhou, China
10. **Tokyo Metropolitan Government Building** | 543 | 1,781 | 48 | Tokyo, Japan

Here are some interesting observations:

* The top two buildings are both in the Middle East, with the Burj Khalifa being the tallest building in the world.
* There are three buildings from China in this list (Shanghai Tower, Ping An Finance Center, and Canton Tower).
* Two buildings from Tokyo, Japan make it to the top 10: Tokyo Skytree and Tokyo Metropolitan Government Building.
* The United Arab Emirates has two representatives on this list (Burj Khalifa and Abu Dhabi Plaza).

These towering structures are not only marvels of engineering but also serve as iconic landmarks for their respective cities.\
`,
      date: new Date("5/12/2024 15:52:10"),
    },
    {
      user: {
        username: "Charles",
      },
      content: "Generate a cool equation!",
      date: new Date("5/12/2024 15:51:22"),
      isEdited: true,
    },
    {
      status: "completed",
      model: "llama3:7B",
      content: `\
Here's one:

**Elegant Equation:**

π × e^(iπ/2) + √(3^3 - 2^2) = 1

**What makes it cool?**

1. **Mathematical beauty**: The combination of mathematical constants (π and e) with irrational numbers (square root) creates a visually appealing equation.
2. **Hidden pattern**: The use of π, e, and the square root symbol (√) forms a subtle pattern that resembles a DNA helix or a spiral staircase.
3. **Mathematical significance**: This equation is closely related to the famous Euler's Identity (e^(iπ) + 1 = 0), which is considered one of the most beautiful and profound
equations in mathematics.

**Breakdown:**

* π (pi) represents the ratio of a circle's circumference to its diameter.
* e is the base of the natural logarithm, approximately equal to 2.71828.
* i is the imaginary unit, defined as the square root of -1.
* The exponentiation operation e^(iπ/2) can be thought of as "rotating" the value of π by 90 degrees in a complex plane.
* The expression √(3^3 - 2^2) evaluates to the square root of the difference between the cube of 3 and the square of 2, which simplifies to 1.

Feel free to try solving this equation or explore its connections to other mathematical concepts!

Would you like me to generate another cool equation?\
`,
      date: new Date("5/12/2024 15:52:10"),
      isEdited: true,
    },
  ]

  let model: string = "llama3:7B"

</script>

<div class="w-full h-dvh flex flex-col">
  <AppBar class="shadow-lg z-[1]">
    <ModelSelector bind:model />
  </AppBar>
  <div class="flex-auto overflow-y-scroll">
    {#if activeSession === null}
      <Welcome />
    {:else}
      <BubbleList {feeds} />
    {/if}
  </div>
  <div class="px-4 py-2 z-[1] shadow-lg">
    <PromptEntry />
  </div>
</div>
