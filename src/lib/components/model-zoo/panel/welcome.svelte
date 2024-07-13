<script lang="ts">
  import { onDestroy } from "svelte";

  let clickTimes = 0

  let clearTimer: Timer | null = null

  onDestroy(() => {
    if (clearTimer) {
      clearTimeout(clearTimer)
    }
  })
</script>

<div class="my-auto place-self-center">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <span
    class="text-center font-bold text-2xl select-none"
    on:click={ev => {
      if (clearTimer) {
        clearTimeout(clearTimer)
        clearTimer = null
      }

      if (clickTimes < 10) {
        clickTimes++

        clearTimer = setTimeout(() => {
          clickTimes = 0
          clearTimer = null
        }, 1000)
      } else {
        // EaStEr eGg ;)
        ev.currentTarget.innerText = `${atob("RGV2aWFudHNzcy4uLiBGYXNjaW5hdGluZywgYXJlbid0IHRoZXk/Cg==").replace("\n", "")} 😏`
      }
    }}
  >
    Your llamas, your rules! 🦙
  </span>
</div>

