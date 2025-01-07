<script lang="ts">
  import { onMount } from "svelte"

  const egg = atob("RGV2aWFudHMsIGZhc2NpbmF0aW5nIGFyZW4ndCB0aGV5Pwo=")
  let eggTriggered = $state(false)

  let text = $state("Oh llama, your llama. 🦙")

  let clickedTimes = $state(0)

  let timerId = $state<number | null>(null)

  function clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId)
    }
  }

  function resetTimer() {
    clearTimer()
    setTimeout(() => {
      clickedTimes = 0
      timerId = null
    }, 5_000)
  }

  onMount(() => {
    return () => {
      clearTimer()
    }
  })
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events  -->
<span
  class="font-bold text-2xl select-none"
  onclick={() => {
    if (eggTriggered) {
      return
    }

    if (clickedTimes >= 10) {
      eggTriggered = true
      clearTimer()
      text = egg + " 😏"
      return
    }

    clickedTimes++
  }}
>
  {text}
</span>
